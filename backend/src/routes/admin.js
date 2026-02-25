import express from "express";
import { q } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = express.Router();

router.get("/overview", auth, requireRole("owner", "admin"), async (req, res) => {
    const tenantId = req.user.tenantId;

    const [usersCount, logsCount, tenant] = await Promise.all([
        q(`SELECT COUNT(*)::int AS count FROM users WHERE tenant_id = $1`, [tenantId]),
        q(`SELECT COUNT(*)::int AS count FROM audit_logs WHERE tenant_id = $1`, [tenantId]),
        q(`SELECT id, name, slug, plan, subscription_status FROM tenants WHERE id = $1`, [tenantId])
    ]);

    res.json({
        tenant: tenant.rows[0],
        metrics: {
            totalUsers: usersCount.rows[0].count,
            totalAuditEvents: logsCount.rows[0].count
        }
    });
});

export default router;
