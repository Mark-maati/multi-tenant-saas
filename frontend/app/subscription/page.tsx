"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubscriptionPage() {
    const [plan, setPlan] = useState("free");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function simulate() {
        setLoading(true);
        setMsg("");
        setErr("");
        try {
            const res = await api<{ message: string }>("/api/subscription/simulate", {
                method: "POST",
                body: JSON.stringify({ plan, status: "active" })
            });
            setMsg(res.message);
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Manage Subscription</CardTitle>
                    <CardDescription>
                        Change your current billing plan. This is a simulated environment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {msg && (
                        <div className="p-3 text-sm text-green-700 bg-green-500/10 border border-green-500/20 rounded-md">
                            {msg}
                        </div>
                    )}
                    {err && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {err}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Select value={plan} onValueChange={setPlan}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="free">Free - Limited Features</SelectItem>
                                <SelectItem value="pro">Pro - Standard Team</SelectItem>
                                <SelectItem value="enterprise">Enterprise - Unlimited</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={simulate} className="w-full" disabled={loading}>
                        {loading ? "Processing..." : "Apply Plan Change"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
