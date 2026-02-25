import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool, q } from "../db.js";

const router = express.Router();

const registerSchema = z.object({
    tenantName: z.string().min(2).max(120),
    tenantSlug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8)
});

const loginSchema = z.object({
    tenantSlug: z.string(),
    email: z.string().email(),
    password: z.string()
});

// Register tenant + owner
router.post("/register", async (req, res) => {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }

    const { tenantName, tenantSlug, fullName, email, password } = parseResult.data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const t = await client.query(
            `INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING id, name, slug, plan, subscription_status`,
            [tenantName, tenantSlug]
        );

        const passwordHash = await bcrypt.hash(password, 10);
        const u = await client.query(
            `INSERT INTO users (tenant_id, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, 'owner', $4)
       RETURNING id, tenant_id, email, role, full_name`,
            [t.rows[0].id, email, passwordHash, fullName]
        );

        await client.query(
            `INSERT INTO audit_logs (tenant_id, user_id, action, metadata)
       VALUES ($1, $2, 'tenant_registered', $3)`,
            [t.rows[0].id, u.rows[0].id, JSON.stringify({ tenantSlug })]
        );

        await client.query("COMMIT");

        const token = jwt.sign(
            { userId: u.rows[0].id, tenantId: u.rows[0].tenant_id, role: u.rows[0].role, email: u.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: u.rows[0], tenant: t.rows[0] });
    } catch (e) {
        await client.query("ROLLBACK");
        res.status(400).json({ error: "Registration failed", details: e.message });
    } finally {
        client.release();
    }
});

// Login by tenant slug + email + password
router.post("/login", async (req, res) => {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }

    const { tenantSlug, email, password } = parseResult.data;

    const result = await q(
        `SELECT u.id, u.tenant_id, u.email, u.password_hash, u.role, u.full_name, t.name as tenant_name, t.slug as tenant_slug
     FROM users u
     JOIN tenants t ON t.id = u.tenant_id
     WHERE t.slug = $1 AND u.email = $2 AND u.is_active = true`,
        [tenantSlug, email]
    );

    if (!result.rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user.id, tenantId: user.tenant_id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
        tenant: { name: user.tenant_name, slug: user.tenant_slug }
    });
});

export default router;
