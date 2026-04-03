# Komdigi Staff Survey

[![CI](https://github.com/erikgunawans/komdigi-staff-survey/actions/workflows/ci.yml/badge.svg)](https://github.com/erikgunawans/komdigi-staff-survey/actions/workflows/ci.yml)
[![Production Health](https://github.com/erikgunawans/komdigi-staff-survey/actions/workflows/production-health.yml/badge.svg)](https://github.com/erikgunawans/komdigi-staff-survey/actions/workflows/production-health.yml)

Next.js survey application for collecting internal staff feedback, with either token-based access or Google/Microsoft work-account sign-in.

## What it includes

- Staff survey flow at `/`
- Protected survey session at `/survey`
- Admin analytics dashboard at `/admin`
- CSV export for responses
- Postgres-backed invite, identity, session, and response storage
- Optional Google Workspace and Microsoft Entra ID login
- Super-admin allowlist for specific non-domain emails

## Tech stack

- Next.js App Router
- NextAuth.js
- PostgreSQL via `pg`
- Vercel deployment

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy env template

```bash
cp .env.example .env.local
```

3. Fill in the required values in [`.env.local`](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/.env.local)

4. Run the schema in your Postgres database using [db/schema.sql](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/db/schema.sql)

5. Start the app

```bash
npm run dev
```

6. Open `http://127.0.0.1:3000`

## Environment variables

Base app:

- `DATABASE_URL`: Postgres connection string
- `SURVEY_TOKEN_SECRET`: used to hash and verify distributed survey tokens
- `ADMIN_ACCESS_KEY`: password for `/admin`

Work-account auth:

- `NEXTAUTH_SECRET`: required for NextAuth session signing
- `NEXTAUTH_URL`: app base URL, for example `http://127.0.0.1:3000` locally or `https://staff-survey-app.vercel.app` in production
- `ALLOWED_EMAIL_DOMAINS`: comma-separated allowlist such as `komdigi.go.id`
- `SUPER_ADMIN_EMAILS`: comma-separated emails that bypass the domain restriction and can open `/admin`

Google:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Microsoft:

- `AZURE_AD_CLIENT_ID`
- `AZURE_AD_CLIENT_SECRET`
- `AZURE_AD_TENANT_ID`

See [`.env.example`](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/.env.example) for the full template.

## Local development

Build check:

```bash
npm run build
```

Generate one invite and insert it into the database:

```bash
npm run generate:invite -- broadband --insert
```

Generate a CSV batch of invite links:

```bash
npm run generate:invites -- --count 25 --team broadband --insert --out exports/broadband-invites.csv
```

Export responses:

```bash
npm run export:responses -- --out exports/survey-responses.csv
```

## Admin dashboard

Open [`/admin`](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/app/admin/page.jsx) to:

- review total invites, submissions, and completion rate
- inspect response trends and bottlenecks
- compare results by team
- read open-text highlights
- search raw responses
- download the latest CSV export

Access options:

- `ADMIN_ACCESS_KEY`
- signed-in email listed in `SUPER_ADMIN_EMAILS`

## Auth behavior

Token mode:

- active when work-account auth is not fully configured
- staff enter a distributed survey token

Work-account mode:

- active when `NEXTAUTH_SECRET`, at least one provider, and email policy are configured
- homepage switches to Google and/or Microsoft sign-in
- one verified identity maps to one survey record

## Google OAuth setup

For the Google client used by production, add these values in Google Cloud:

Authorized JavaScript origins:

- `https://staff-survey-app.vercel.app`
- `http://127.0.0.1:3000`

Authorized redirect URIs:

- `https://staff-survey-app.vercel.app/api/auth/callback/google`
- `http://127.0.0.1:3000/api/auth/callback/google`

The client ID and client secret must come from the same Google OAuth client.

## Deployment

This app is designed to be deployed as its own Vercel project.

Recommended production steps:

1. Create a Vercel project for this repository
2. Add the production env vars
3. Run [db/schema.sql](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/db/schema.sql) against the production database
4. Deploy
5. Verify `/`, `/survey`, and `/admin`

## Production health checks

This repo now includes:

- a production health endpoint at `/api/health`
- a GitHub Actions workflow at [`.github/workflows/production-health.yml`](/Users/erikgunawansupriatna/survey-komdigi/staff-survey-app/.github/workflows/production-health.yml)

The health endpoint checks:

- app reachability
- database connectivity
- presence of the required survey tables

The GitHub workflow runs:

- on manual trigger
- every 30 minutes

It verifies:

- homepage returns `200`
- admin page returns `200`
- `/api/health` returns `ok: true`
- database service reports healthy

## Security notes

- Real secrets are intentionally excluded from git
- Generated invite exports and response exports are ignored
- Raw invite tokens should be treated as sensitive
- Only share admin access with trusted internal users
