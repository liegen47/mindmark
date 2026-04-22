# MindMark - Agent Instructions

## Commands

```bash
npm run dev      # Dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (src only)
npm run generate # Drizzle: create migration from schema changes
npm run push     # Drizzle: push schema to database
npm run migrate  # Drizzle: run pending migrations
npm run pull     # Drizzle: introspect DB to schema
```

## Setup Requirements

- `.env` must contain: `DATABASE_URL`, `DB_USER`, `DB_PASSWORD`
- Database: Supabase PostgreSQL (AWS pooler for connections)

## Architecture

- **Framework**: Next.js 16 (App Router), React 19, Turbopack
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **ORM**: Drizzle ORM (schema in `src/lib/supabase/schema.ts`)
- **Auth**: Supabase Auth with SSR (`@supabase/ssr`)

## Route Structure

```
src/app/
├── (auth)/           # Auth routes (login, signup, etc.)
├── (main)/dashboard/ # Protected app routes
│   └── [workspaceId]/
│       └── [folderId]/
│           └── [fileId]/
├── (site)/           # Public landing page
└── api/auth/callback/ # Auth callback handler
```

## Database

- **Tables**: `workspaces`, `folders`, `files` (via Drizzle)
- **Migrations**: `migrations/` folder
- **FK cascade**: Deleting workspace/folder cascades to children

## Notes

- No test framework configured
- No prettier config (uses defaults)
- Drizzle config requires `.env` loaded via dotenv