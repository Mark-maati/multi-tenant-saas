import { authStore } from "./auth";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = authStore.getToken();

    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        }
    });

    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "Request failed");
    }

    return res.json();
}
