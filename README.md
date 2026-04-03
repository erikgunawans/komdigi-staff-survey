# Staff Survey App

Separate Next.js app for the token-gated Komdigi staff questionnaire.

## What this app does

- Accepts a one-time survey token instead of email login
- Creates a server-side session cookie after token validation
- Saves answers to Postgres
- Marks the token as submitted after final completion
- Prevents the same token from being submitted again
- Can switch to verified work-account login so staff no longer need admin-issued tokens

## Setup

1. Create a separate Vercel project and point its root directory to `staff-survey-app/`
2. Provision a Postgres database
3. Run [`db/schema.sql`](./db/schema.sql)
4. Add environment variables from [`.env.example`](./.env.example)
5. Generate invite tokens with:

```bash
npm run generate:invite -- broadband --insert
```

## Notes

- Tokens are hashed before lookup, so raw tokens are never stored in the database.
- This is stronger than cookies-only because one response is tied to one distributed link.
- If you need people to resume on another device, reuse the same invite link before final submission.
- A token cannot open a second active session while an unexpired session already exists.
- Set `ADMIN_ACCESS_KEY` to open the protected `/admin` dashboard for viewing results in the browser.
- To activate work-account login, set `NEXTAUTH_SECRET`, one provider (`GOOGLE_*` or `AZURE_AD_*`), and `ALLOWED_EMAIL_DOMAINS`.
- Use `SUPER_ADMIN_EMAILS` for specific addresses that should bypass the domain restriction and open `/admin` after signing in.

## Bulk operations

Generate a CSV full of invite links:

```bash
npm run generate:invites -- --count 25 --team broadband --insert --out exports/broadband-invites.csv
```

Export all responses to CSV:

```bash
npm run export:responses -- --out exports/survey-responses.csv
```

## Admin dashboard

- Open `/admin`
- Login with `ADMIN_ACCESS_KEY`
- Review live submissions in the browser
- Click "Unduh CSV Hasil" to download the latest export directly

## Work account login

- If Google Workspace or Microsoft credentials are configured, the homepage switches from token entry to work-account sign-in automatically.
- Only users whose email domain matches `ALLOWED_EMAIL_DOMAINS` can access the survey.
- Emails listed in `SUPER_ADMIN_EMAILS` are allowed even if they are outside the normal domain allowlist.
- If both Google and Microsoft are enabled, the app merges them by verified email so the same `@komdigi.go.id` user still only gets one submission.
