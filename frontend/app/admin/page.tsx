"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPage() {
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        api("/api/admin/overview")
            .then(setData)
            .catch((e) => setErr(e.message));
    }, []);

    if (err) {
        return (
            <div className="flex h-screen items-center justify-center p-4">
                <div className="p-4 text-destructive bg-destructive/10 rounded-md border border-destructive/20 max-w-md">
                    <h2 className="font-semibold mb-2">Error Loading Admin Data</h2>
                    <p className="text-sm">{err}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center p-12 h-screen">
                <p className="text-muted-foreground animate-pulse">Loading administration data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your tenant settings and monitor platform usage.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tenant Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.tenant.name}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Plan: <span className="capitalize font-medium">{data.tenant.plan}</span>
                            </p>
                            <div className="mt-2 inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 border border-green-500/20">
                                {data.tenant.subscription_status}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Active in workspace
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.metrics.totalAuditEvents}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Logged security events
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
