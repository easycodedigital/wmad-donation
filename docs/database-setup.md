# Database setup

This app uses **PostgreSQL** with [Prisma](https://www.prisma.io/) for schema and migrations. Follow this guide to set up a database for local development or a new deployment.

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL database (empty for a fresh setup)
- Project dependencies installed:

```bash
npm install
```

`postinstall` runs `prisma generate` automatically so the Prisma client matches `prisma/schema.prisma`.

## 1. Create a PostgreSQL database

Use any PostgreSQL 14+ host. Common options:

| Provider | Notes |
|----------|--------|
| [Neon](https://neon.tech) | Serverless Postgres; use the **pooled** URL for the app and the **direct** URL for migrations if the pooler errors on DDL |
| [Supabase](https://supabase.com) | Use the **Transaction** pooler URL for serverless runtime |
| [Vercel Postgres](https://vercel.com/storage/postgres) | Integrated with Vercel deploys |
| Local Docker | `docker run -d --name wmad-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16` |

Create an empty database (or a new Neon project / Supabase project). You need a connection string in this form:

```
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

For local Postgres without SSL, you can omit `?sslmode=require`.

## 2. Configure environment variables

Copy the example env file and set your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by the app and Prisma CLI |
| `JWT_SECRET` | Yes | Random secret for auth cookies (e.g. `openssl rand -base64 32`) |
| `DIRECT_URL` | No | Non-pooled URL for migrations only (optional; see [Neon docs](https://neon.tech/docs/connect/connection-pooling)) |

Next.js loads `.env.local` in development. Never commit real credentials.

## 3. Apply database migrations

### Fresh (empty) database

Point `DATABASE_URL` at the empty database, then run:

```bash
npm run db:migrate:deploy
```

This applies all migrations in `prisma/migrations/` and creates:

- **User** — accounts (`ADMIN` / `MEMBER`, status `PENDING` / `APPROVED` / `DISABLED`)
- **Donation** — donation records with payment metadata
- **WarmWish** — member warm-wish messages

Equivalent command:

```bash
npx prisma migrate deploy
```

### Existing database (P3005 error)

If `migrate deploy` fails with **P3005** (*The database schema is not empty*), the database was created outside Prisma Migrate. Baseline it once — see [prisma-baseline-existing-database.md](./prisma-baseline-existing-database.md).

```bash
npm run db:baseline:mark-all-applied
npx prisma migrate deploy
```

### Local schema development

When you change `prisma/schema.prisma` during development, create and apply a new migration:

```bash
npm run prisma:migrate
```

This runs `prisma migrate dev` (interactive; may reset dev data). Do not use `migrate dev` against production.

## 4. Create an admin user

The app requires at least one **APPROVED** admin to manage members and donations. After migrations succeed:

```bash
npm run admin:create -- admin@example.com your-secure-password "Admin Name"
```

The script upserts by email: safe to run again to reset password or name.

Optional — create a pre-approved member:

```bash
npm run member:create -- member@example.com password "Member Name"
```

## 5. Verify the setup

**Prisma Studio** (optional GUI):

```bash
npx prisma studio
```

Opens a browser UI at `http://localhost:5555` to inspect tables.

**App smoke test:**

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)
2. Log in at `/login` with the admin account
3. Confirm dashboard and DB-backed pages load without errors

## Schema overview

Defined in `prisma/schema.prisma`:

| Model | Purpose |
|-------|---------|
| `User` | Authentication, roles, profile (`profileImage`, `major`) |
| `Donation` | Amount, status, payment type, proof image, notes |
| `WarmWish` | Short messages linked to users |

Enums: `Role`, `Status`, `DonationStatus`, `PaymentType`.

## NPM scripts reference

| Script | Command | When to use |
|--------|---------|-------------|
| `db:migrate:deploy` | `prisma migrate deploy` | Apply migrations to dev/staging/production |
| `prisma:migrate` | `prisma migrate dev` | Local development after schema changes |
| `db:baseline:mark-all-applied` | `prisma migrate resolve --applied …` | One-time fix for P3005 on existing DB |
| `build:with-migrate` | generate + migrate deploy + build | CI or manual deploy with migrations |
| `admin:create` | `scripts/create-admin.mjs` | Create or update admin user |
| `member:create` | `scripts/create-member.mjs` | Create or update approved member |
| `prisma:generate` | `prisma generate` | Regenerate client after pulling schema changes |

## Production (Vercel)

1. Create a production PostgreSQL database (separate from preview/dev if possible).
2. Set `DATABASE_URL` and `JWT_SECRET` in Vercel → **Settings** → **Environment Variables**.
3. From your machine or CI, with production `DATABASE_URL`:

```bash
npx prisma migrate deploy
```

4. Create the production admin (once):

```bash
npm run admin:create -- admin@yourdomain.com …
```

5. Deploy the app. Vercel runs `next build` only; migrations are **not** run during build.

Details: [vercel-environment-variables.md](./vercel-environment-variables.md).

## Troubleshooting

| Issue | What to do |
|-------|------------|
| `P1001` / connection refused | Check host, port, firewall, and that Postgres is running |
| `P1000` / auth failed | Verify user, password, and database name in `DATABASE_URL` |
| `P3005` / schema not empty | [Baseline](./prisma-baseline-existing-database.md) then `migrate deploy` |
| Pooler errors during migrate | Use direct (non-pooled) URL for CLI; keep pooled URL for the app |
| `PrismaClient` out of date | Run `npm run prisma:generate` or `npm install` |
| Login works locally but not on Vercel | Confirm Vercel `DATABASE_URL` and `JWT_SECRET`; run migrations on that DB |

## Quick start checklist

- [ ] PostgreSQL database created (empty)
- [ ] `.env.local` with `DATABASE_URL` and `JWT_SECRET`
- [ ] `npm install`
- [ ] `npm run db:migrate:deploy`
- [ ] `npm run admin:create -- …`
- [ ] `npm run dev` and log in successfully
