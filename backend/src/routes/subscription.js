import express from "express";
import { q } from "../db.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router = express.Router();

// Simulation only (no payment processor)
router.post("/simulate", auth, requireRole("owner", "admin"), async (req, res) => {
    const { plan, status } = req.body; // plan: free/pro/enterprise
    await q(
        `UPDATE tenants SET plan = $1, subscription_status = $2 WHERE id = $3`,
        [plan, status || "active", req.user.tenantId]
    );

    await q(
        `INSERT INTO audit_logs (tenant_id, user_id, action, metadata)
     VALUES ($1, $2, 'subscription_changed', $3)`,
        [req.user.tenantId, req.user.userId, JSON.stringify({ plan, status })]
    );

    res.json({ message: "Subscription updated (simulation)." });
});

export default router;
