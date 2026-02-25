import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";

async function seed() {
    const client = await pool.connect();
    try {
        const email = "admin@example.com";
        const password = "password123";
        const tenantSlug = "acme";

        // Check if tenant exists
        let t = await client.query("SELECT * FROM tenants WHERE slug = $1", [tenantSlug]);
        let tenantId;
        if (t.rows.length === 0) {
            t = await client.query(
                `INSERT INTO tenants (name, slug) VALUES ('Acme Corp', $1) RETURNING id`,
                [tenantSlug]
            );
            tenantId = t.rows[0].id;
        } else {
            tenantId = t.rows[0].id;
        }

        // Check if user exists
        let u = await client.query("SELECT * FROM users WHERE email = $1 AND tenant_id = $2", [email, tenantId]);
        if (u.rows.length === 0) {
            const passwordHash = await bcrypt.hash(password, 10);
            await client.query(
                `INSERT INTO users (tenant_id, email, password_hash, role, full_name)
         VALUES ($1, $2, $3, 'owner', 'Admin User')`,
                [tenantId, email, passwordHash]
            );
            console.log("Created default user!");
        } else {
            console.log("Default user already exists!");
        }
        console.log(`Login Credentials:
Tenant Slug: ${tenantSlug}
Email: ${email}
Password: ${password}`);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        process.exit(0);
    }
}

seed();
