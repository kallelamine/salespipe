# Innvotra — Salespipe

**Innvotra Salespipe** is a **React + TypeScript** web app for CRM-style workflows: organizations, contacts, opportunities, activities, action logs, partners, and team members. The UI is **Arabic-first (RTL)**. Data and auth are backed by **[Supabase](https://supabase.com/)** (PostgreSQL, Auth, Row Level Security). There is **no custom backend** in this repository—the browser talks to Supabase directly.

**Branding:** in-app and social preview logo — `public/logoinnvotra.png`; favicon — `public/favicon.ico`.

---

## Tech stack

| Area | Technologies |
|------|----------------|
| UI | React 18, Vite 5, TypeScript |
| Routing | React Router v6 |
| Data | Supabase JS, TanStack React Query |
| Forms | react-hook-form, Zod |
| Styling | Tailwind CSS, Radix UI, shadcn-style components |
| Auth | Supabase (email/password); Google OAuth via Lovable cloud auth → Supabase session |
| Charts / UX | Recharts, Framer Motion, dnd-kit (hello-pangea) |

Database schema and RLS live in `supabase/migrations/`. TypeScript types for tables are in `src/integrations/supabase/types.ts`.

---

## Prerequisites

- **Node.js** 20+ (with `npm`) — for local development without Docker  
- **Docker Desktop** (or Docker Engine + Compose v2) — for containerized run  
- A **Supabase project** with migrations applied and the **anon (publishable) key**

---

## Environment variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your project URL, e.g. `https://xxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase **anon / publishable** key (safe for the browser with RLS) |
| `DOCKER_WEB_PORT` | No | Host port when using Docker Compose (default **8080**) |

**Important:** Never put the Supabase **service_role** key in `.env` or in the frontend/Docker build. Only the publishable key belongs here.

Vite reads `VITE_*` variables at **build time**; changing them requires a **rebuild** (locally or in Docker).

---

## Run locally (without Docker)

```bash
npm install
npm run dev
```

Vite is configured to listen on port **8080** by default (`vite.config.ts`). If that port is busy, Vite will suggest another (e.g. 8081).

Other scripts:

| Command | Description |
|---------|-------------|
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

---

## Run with Docker

The image is **multi-stage**: Node builds the SPA, then **nginx** serves static files from `dist/`. Supabase settings are passed as **build arguments** so Vite can embed them in the bundle.

### 1. Prepare `.env`

Copy the example and fill in your Supabase values:

```bash
copy .env.example .env
```

Edit `.env` and set at least:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Optional: set `DOCKER_WEB_PORT=8080` (or another port if 8080 is already in use).

### 2. Build and start (recommended)

From the project root:

```bash
docker compose up --build -d
```

- **App URL:** `http://localhost:8080` (or `http://localhost:<DOCKER_WEB_PORT>` if you changed it)

### 3. Useful Docker commands

| Command | Description |
|---------|-------------|
| `docker compose logs -f web` | Follow container logs |
| `docker compose down` | Stop and remove the container |
| `docker compose up --build` | Rebuild after changing code or `.env` values |

**After changing `VITE_*` in `.env`, run `docker compose up --build` again** so the image is rebuilt with the new values.

#### Port already in use

If you see `Bind for 0.0.0.0:8080 failed: port is already allocated`, another app (or Vite) is using that port. Either stop it or pick another host port:

**PowerShell**

```powershell
$env:DOCKER_WEB_PORT="18080"
docker compose up --build -d
```

Or add `DOCKER_WEB_PORT=18080` to `.env` and run `docker compose up --build -d` again.

### 4. Build / run without Compose

```bash
docker build ^
  --build-arg VITE_SUPABASE_URL="https://YOUR_PROJECT.supabase.co" ^
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_KEY" ^
  -t growth-catalyst-hub .

docker run -p 8080:80 growth-catalyst-hub
```

(PowerShell: use line continuation `` ` `` instead of `^` if you prefer.)

---

## Supabase configuration for production

When you deploy to a real domain:

1. In **Supabase Dashboard → Authentication → URL configuration**, set **Site URL** and add **Redirect URLs** for your production origin (and `http://localhost:8080` for Docker/local tests if needed).
2. Ensure **Google OAuth** (if used) allows that redirect URI in Google Cloud Console.

---

## Project layout (high level)

```
src/
  App.tsx                 # Routes + protected layout
  pages/                  # Auth, Index, NotFound
  contexts/AuthContext.tsx
  hooks/useSupabaseData.ts
  integrations/supabase/  # Client + generated DB types
  integrations/lovable/   # Google OAuth bridge
supabase/migrations/      # SQL schema + RLS
nginx/default.conf        # SPA + gzip (used by Docker)
Dockerfile
docker-compose.yml
```

---

## License

Private project (`"private": true` in `package.json`). Adjust as needed for your client or organization.
