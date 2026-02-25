# Production Hardening Checklist

Before deploying this SaaS platform to a production environment, complete the following items to ensure optimal security, performance, and reliability.

## Authentication & Security
- [ ] **Refresh Tokens**: Implement short-lived access tokens and secure refresh tokens to minimize risk from stolen access tokens.
- [ ] **httpOnly Cookies**: Store authentication tokens in `httpOnly` secure cookies rather than `localStorage` to mitigate XSS attacks.
- [ ] **Rate Limiting**: Implement rate limiters on API endpoints (especially `/api/auth/login` and `/api/auth/register`) to prevent brute-force and DDoS attacks (e.g., using `express-rate-limit`).
- [ ] **CORS Settings**: Restrict the backend CORS configuration to exactly match the production frontend URL.
- [ ] **Helmet**: Use `helmet` in the Express app to set secure HTTP headers.
- [ ] **Row-Level Security (RLS)**: If utilizing Supabase or advanced PostgreSQL roles, configure RLS to enforce tenant isolation at the database level.

## Database & Data
- [ ] **Connection Pooling**: Optimize database connections using a configured pool with reasonable limits.
- [ ] **Backups**: Implement daily automated backups with point-in-time recovery for the PostgreSQL database.
- [ ] **Passwords**: Enforce strict password complexity requirements and ensure hashing cost factor (bcrypt rounds) is appropriate for modern hardware (typically 12+).

## Environment Configuration
- [ ] **Secrets Management**: Move sensitive variables (`JWT_SECRET`, `DATABASE_URL`) into a secure Secrets Manager (e.g., AWS Secrets Manager, Vercel Environment Variables) rather than plain `.env` files.
- [ ] **Node Environment**: Set `NODE_ENV=production` standard configuration flag for performance optimizations across Node dependencies.

## Deployment & Monitoring
- [ ] **Logging Strategy**: Replace generic `console.log` with structured logging tools (e.g., Pino, Winston) and stream logs to a service like Datadog or CloudWatch.
- [ ] **Error Handling**: Set up an APM like Sentry for tracking unhandled backend errors and front-end crashes.
- [ ] **Health Checks**: Expand the root `/api/health` endpoint to actually verify database connectivity before returning a 200 OK.
