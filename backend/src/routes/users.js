import express from "express";
import { q } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
    const me = await q(
        `SELECT id, email, role, full_name, tenant_id FROM users WHERE id = $1`,
        [req.user.userId]
    );
    res.json(me.rows[0]);
});

router.get("/", auth, requireRole("owner", "admin"), async (req, res) => {
    const users = await q(
        `SELECT id, email, role, full_name, created_at
     FROM users
     WHERE tenant_id = $1
     ORDER BY created_at DESC`,
        [req.user.tenantId]
    );
    res.json(users.rows);
});

export default router;
