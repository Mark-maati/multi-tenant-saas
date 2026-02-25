# Multi-Tenant SaaS Platform

This is a complete, practical multi-tenant SaaS application built for modern web portfolios. It demonstrates real SaaS architecture like tenant isolation, Role-Based Access Control (RBAC), and full-stack integration.

## Technologies Used

*   **Frontend**: Next.js (App Router), React, TypeScript.
*   **Backend**: Node.js, Express (ES Modules), JavaScript.
*   **Database**: PostgreSQL.
*   **Authentication**: JWT.

## Features

*   **Multi-tenant ready architecture:** Tenants are isolated, users belong to a tenant.
*   **Role-Based Access Control (RBAC):** Roles including owner, admin, member, and viewer.
*   **Admin Dashboard:** Basic metrics and tenant info for owners and admins.
*   **Audit Logging:** Critical actions are kept in an audit_logs table.
*   **Subscription Simulation:** Ability to adjust tenant plans.
*   **API Integration:** Demo proxy integration with external APIs.

## Setup Instructions

### Pre-requisites
1. Node.js >= 18.x
2. PostgreSQL running locally or via Docker.

### 1. Database Setup
Ensure PostgreSQL is running. Create a database called `saas_db`, then apply the schema:
```bash
psql -U postgres -d saas_db -f database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Setup
You can also use the included `docker-compose.yml` to spin up the database.
```bash
docker-compose up -d
```

## Structure overview
- `database/schema.sql`: Contains the schema definitions for PostgreSQL.
- `backend/`: The Express API. Exposes endpoints to `auth`, `users`, `admin`, and `subscriptions`.
- `frontend/`: The Next.js front-end application connecting to the backend for data.
