-- database/schema.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(80) UNIQUE NOT NULL,
  plan VARCHAR(30) NOT NULL DEFAULT 'free',               -- free/pro/enterprise
  subscription_status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',             -- owner/admin/member/viewer
  full_name VARCHAR(120),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(120) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Tenants Policy: Can only view their own tenant record
CREATE POLICY tenant_isolation_policy ON tenants
  USING (id = nullif(current_setting('app.current_tenant', true), '')::uuid);

-- Users Policy: Can only view/edit users in their own tenant
CREATE POLICY user_isolation_policy ON users
  USING (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

-- Audit Logs Policy: Can only view logs for their own tenant
CREATE POLICY audit_isolation_policy ON audit_logs
  USING (tenant_id = nullif(current_setting('app.current_tenant', true), '')::uuid);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
