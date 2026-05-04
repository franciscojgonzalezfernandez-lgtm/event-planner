<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project Context

## Stack

- **Next.js 16.2.3** (App Router) — read `node_modules/next/dist/docs/01-app/` before touching routing or caching
- **React 19**
- **Tailwind CSS 4** — no config file; classes defined via CSS variables in `app/globals.css`
- **Prisma ORM** + PostgreSQL
- **NextAuth.js** — OAuth only (GitHub + Google), no credentials provider; configured in `auth.ts`
- **date-fns** — used for date formatting
- **Zod** — validation in server actions

## Directory structure

```
app/
  api/
    auth/[...nextauth]/route.ts
    dashboard/events/route.ts
    dashboard/rsvps/route.ts
    events/route.ts
    events/[eventId]/route.ts      ← GET / PUT / DELETE a specific event
  components/
    EventActions.tsx               ← Edit + Delete buttons (client, shown to owner only)
    EventList.tsx                  ← Grid list with search/filter
    Navbar.tsx
    RSVPButtons.tsx
    GithubSignInButton.tsx
    GoogleSignInButton.tsx
  dashboard/page.tsx
  events/
    page.tsx                       ← public event listing
    create/page.tsx                ← create form (client, useActionState)
    [eventId]/
      page.tsx                     ← event detail (server component)
      edit/
        page.tsx                   ← edit page (server component, fetches + auth-guards)
        EditEventForm.tsx          ← edit form (client, useActionState)
  login/page.tsx
  layout.tsx
  globals.css
lib/
  event-actions.ts                 ← createEvent, updateEvent, deleteEvent, rsvpToEvent
  auth-actions.ts                  ← loginGithub, loginGoogle, logout
  models.ts                        ← TypeScript interfaces: Event, EventRSVP, RSVPStatus
  prisma.ts                        ← Prisma client singleton
auth.ts                            ← NextAuth config (export: handlers, auth, signIn, signOut)
prisma/schema.prisma
```

## Database models (Prisma)

**Event**: `id`, `title`, `description`, `date` (DateTime), `location`, `maxAttendees` (Int?), `isPublic` (Boolean, default true), `image` (String?), `userId`, `createdAt`, `updatedAt`
— relations: `user` (User), `rsvps` (RSVP[])

**RSVP**: `id`, `status` (RSVPStatus), `eventId`, `userId`, `createdAt`, `updatedAt`
— unique constraint: `@@unique([userId, eventId])`

**RSVPStatus enum**: `GOING | NOT_GOING | MAYBE`

**No Tag model exists.** The word "tag" in this codebase always refers to Next.js cache revalidation tags, never to a data model.

## Auth pattern

```ts
import { auth } from "@/auth";
const session = await auth();
session?.user?.id   // string | undefined — the logged-in user's ID
```

OAuth providers: GitHub (`GITHUB_ID`, `GITHUB_SECRET`) and Google (`GOOGLE_ID`, `GOOGLE_SECRET`).

## Server action pattern

File-level `"use server"`. Always: (1) call `auth()`, (2) check `session?.user?.id`, (3) validate with Zod, (4) Prisma operation, (5) call `updateTag(...)` to bust caches, (6) return `{ success: boolean; error?: string }`.

`updateTag` (not `revalidateTag`) is imported from `"next/cache"` — this is the Next.js 16 API.

## Cache tag naming convention

| Tag | When to invalidate |
|-----|--------------------|
| `"events"` | Any change to the events list |
| `` `event-${eventId}` `` | Any change to a specific event |
| `"rsvps"` | Any RSVP change |

Fetch calls opt in with: `{ next: { tags: [`event-${eventId}`] } }`.

## Form pattern (client components)

```ts
const [state, formAction, isPending] = useActionState(serverAction, { success: false, error: "" });
```

To pass extra args (e.g. `eventId`) to a server action, use `.bind`:
```ts
const boundAction = updateEvent.bind(null, eventId);
const [state, formAction, isPending] = useActionState(boundAction, ...);
```

Checkbox `isPublic` sends `"on"` when checked, nothing when unchecked — handled server-side as `formData.get("isPublic") ? "on" : "off"`.

## Dynamic route params

Params are a Promise in Next.js 16 — always await them:
```ts
export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
}
```

## CSS utility classes (from `app/globals.css`)

- **Inputs / selects / textareas**: `input-field`
- **Buttons**: `btn-primary` (blue), `btn-secondary` (cyan), `btn-danger` (red)
- **Container**: `card` (slate-800 background, border-slate-700)
- **Colors**: foreground `#f1f5f9`, muted `#94a3b8`, primary `#3b82f6`, secondary `#06b6d4`, background `#0b1120`

No external component library (no shadcn/ui, no MUI). Pure Tailwind + native HTML elements.

## Formatting dates for `datetime-local` inputs

```ts
import { format } from "date-fns";
format(new Date(event.date), "yyyy-MM-dd'T'HH:mm")
```
