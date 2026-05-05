# Evently — Plan Events Together

## 🚀 About This Project

**A production-ready full-stack event management platform** built with the latest Next.js App Router architecture. Evently demonstrates advanced full-stack patterns: server actions, streaming with Suspense, dynamic OG metadata, role-based authorization, and real-time RSVP management — all in a single, cohesive codebase.

👈 **[Live Demo](https://event-planner-rho-cyan.vercel.app/)**

📖 **[Portfolio](https://franciscojgonzalezfernandez-lgtm.github.io/my-portfolio/)**

## ✨ Featured Technologies

| Category   | Tech Stack                                    |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16.2.3 (App Router)                   |
| Language   | TypeScript 5                                  |
| UI         | React 19.2 + Tailwind CSS 4                   |
| Database   | PostgreSQL on Neon (serverless)               |
| ORM        | Prisma 7 with connection pooling (pg adapter) |
| Auth       | NextAuth.js 5 — GitHub & Google OAuth         |
| Validation | Zod 4 (server-side schema validation)         |
| Testing    | Vitest + React Testing Library                |
| Deployment | Vercel + Vercel Analytics + Speed Insights    |

## 🎯 Key Features

- **Next.js 16 Server Actions** — form submissions handled entirely server-side with `useActionState`, no API boilerplate
- **Streaming + Loading Skeletons** — every route has a dedicated `loading.tsx` skeleton, giving instant perceived performance with React Suspense
- **Dynamic SEO Metadata** — `generateMetadata` per route: each public event page gets its own `og:title`, `og:description`, and `og:image` automatically
- **Role-based Authorization** — `unauthorized()` (Next.js 16 built-in) guards server components; private events return 403 at the API level
- **RSVP System** — upsert pattern with three states (Going / Maybe / Not Going) and cache tag invalidation on every mutation
- **OAuth Authentication** — GitHub + Google sign-in via NextAuth.js, persisted with Prisma adapter
- **Full Test Coverage** — 74 tests across unit, integration, API, and component layers; 2 production bugs caught during test writing
- **Tag-based Cache Revalidation** — `updateTag()` keeps data fresh without full page revalidation

## 🏗️ Architecture Highlights

```
Server Actions ──▶ Zod validation ──▶ Prisma (PostgreSQL/Neon) ──▶ updateTag()
      ▲                                                                    │
      │                                                                    ▼
 useActionState                                               Next.js cache busted
 (client form)                                               → page re-renders fresh
```

**Auth flow:** OAuth provider → NextAuth.js → PrismaAdapter → session cookie → `auth()` in server components & actions

**Private events:** API route checks `isPublic` + session ownership; `generateMetadata` adds `robots: noindex` automatically for private event pages

## 🧪 Testing

```bash
npm test              # run all 74 tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

| Layer      | Scope                            | Tests |
| ---------- | -------------------------------- | ----- |
| Unit       | Zod schema validation            | 14    |
| Actions    | createEvent, updateEvent, delete | 21    |
| Actions    | rsvpToEvent (5 business rules)   | 10    |
| API Routes | /api/events + /api/events/[id]   | 13    |
| Components | RSVPButtons + EventForm          | 16    |

## 🎯 Getting Started

```bash
git clone https://github.com/franciscojgonzalezfernandez-lgtm/event-planner.git
cd event-planner
npm install
```

Create a `.env.local` file:

```env
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

## 📊 Lighthouse

| Performance | Accessibility | Best Practices | SEO   |
| ----------- | ------------- | -------------- | ----- |
| [100]       | [98]          | [100]          | [100] |

Built with ❤️ using 2026's production-ready full-stack Next.js stack

**⭐ Star for more Full Stack Apps**
