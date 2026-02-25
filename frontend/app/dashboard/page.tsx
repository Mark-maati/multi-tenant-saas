"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [me, setMe] = useState<User | null>(null);

    useEffect(() => {
        api<User>("/api/users/me").then(setMe).catch(() => (window.location.href = "/login"));
    }, []);

    if (!me) {
        return (
            <div className="flex items-center justify-center p-12 h-screen">
                <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back, {me.full_name || me.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                            {me.role}
                        </span>
                    </div>
                </header>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">My Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">{me.email}</div>
                            <p className="text-xs text-muted-foreground mt-1">Tenant ID: {me.tenant_id?.slice(0, 8)}...</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button variant="outline" asChild className="w-full justify-start">
                                <Link href="/subscription">Manage Subscription</Link>
                            </Button>
                            {(me.role === "owner" || me.role === "admin") && (
                                <Button variant="default" asChild className="w-full justify-start">
                                    <Link href="/admin">Admin Settings</Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
