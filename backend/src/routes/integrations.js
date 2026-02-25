import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/healthfeed", auth, async (_req, res) => {
    const r = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await r.json();
    res.json({ source: "jsonplaceholder", data });
});

export default router;
