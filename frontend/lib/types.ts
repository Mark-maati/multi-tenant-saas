export type Role = "owner" | "admin" | "member" | "viewer";

export interface User {
    id: string;
    email: string;
    role: Role;
    full_name?: string;
    tenant_id?: string;
}
