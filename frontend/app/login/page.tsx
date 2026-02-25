"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const [tenantSlug, setTenantSlug] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const data = await api<{ token: string }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ tenantSlug, email, password })
            });
            authStore.setToken(data.token);
            router.push("/dashboard");
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center p-4 bg-muted/50">
            <Card className="w-full max-w-sm">
                <form onSubmit={onSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your tenant slug and credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {err && (
                            <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md">
                                {err}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="tenant">Workspace Slug</Label>
                            <Input
                                id="tenant"
                                placeholder="acme-corp"
                                value={tenantSlug}
                                onChange={e => setTenantSlug(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
