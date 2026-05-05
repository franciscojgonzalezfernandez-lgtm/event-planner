# Testing Plan — Evently

## Stack elegido

| Herramienta | Rol |
|-------------|-----|
| **Vitest** | Test runner + assertion library (compatible con Vite/Next.js, más rápido que Jest) |
| **@testing-library/react** | Render + queries para componentes React |
| **@testing-library/user-event** | Simulación de interacciones de usuario (superior a `fireEvent`) |
| **@testing-library/jest-dom** | Matchers extras (`toBeInTheDocument`, `toHaveValue`, …) |
| **jsdom** | Entorno DOM simulado para Vitest |
| **msw** (opcional, fase 2) | Mock Service Worker — intercepta fetches reales en tests de integración |

---

## Setup inicial

### 1. Instalar dependencias

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom
```

### 2. `vitest.config.ts` en la raíz

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

### 3. `vitest.setup.ts` en la raíz

```ts
import "@testing-library/jest-dom";
```

### 4. `package.json` — añadir scripts

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### 5. Mocks globales necesarios

Crear `__mocks__/` en la raíz con:

- **`next/navigation.ts`** — mock de `redirect`, `notFound`, `unauthorized`, `useRouter`
- **`next/cache.ts`** — mock de `updateTag`
- **`@/auth.ts`** — mock de `auth()` que devuelve session configurable
- **`@/lib/prisma.ts`** — mock del cliente Prisma con `vi.fn()` por método

---

## Estructura de archivos de test

```
__tests__/
  unit/
    eventSchema.test.ts          ← validación Zod (sin I/O)
  actions/
    createEvent.test.ts
    updateEvent.test.ts
    deleteEvent.test.ts
    rsvpToEvent.test.ts
  api/
    events.test.ts               ← GET /api/events
    eventById.test.ts            ← GET /api/events/[eventId]
  components/
    EventList.test.tsx
    RSVPButtons.test.tsx
    EventForm.test.tsx
    EventActions.test.tsx
    Navbar.test.tsx
```

---

## Nivel 1 — Unit tests: `eventSchema`

**Archivo:** `__tests__/unit/eventSchema.test.ts`

> Puro Zod, sin mocks. Importar el schema directamente.
> ⚠️ El schema está definido *dentro* de `lib/event-actions.ts` pero no se exporta — habrá que exportarlo o moverlo a `lib/eventSchema.ts` antes de testearlo aisladamente.

### Casos a cubrir

| # | Caso | Resultado esperado |
|---|------|--------------------|
| 1 | Todos los campos válidos + opcionales | `success: true` |
| 2 | Sin `image` ni `maxAttendees` | `success: true` |
| 3 | `title` vacío `""` | error "Title is required" |
| 4 | `description` vacío | error "Description is required" |
| 5 | `location` vacío | error "Location is required" |
| 6 | `date` = `"not-a-date"` | error "Invalid date format" |
| 7 | `date` = `""` | error "Invalid date format" |
| 8 | `maxAttendees` = `"abc"` | error "Max attendees must be a number" |
| 9 | `maxAttendees` = `"10"` | `success: true` |
| 10 | `maxAttendees` = `"0"` | `success: true` (es un número) |
| 11 | `image` = URL válida `"https://..."` | `success: true` |
| 12 | `image` = `"not-a-url"` | error "Invalid image URL" |
| 13 | `image` = `""` | `success: true` (se permite vacío) |
| 14 | `isPublic` = `"on"` | `success: true` |
| 15 | `isPublic` ausente (undefined) | `success: true` |

---

## Nivel 2 — Integration tests: Server Actions

Todos los tests mockean:
- `auth()` de `@/auth` → configurable por test
- `prisma` de `@/lib/prisma` → `vi.fn()` por método
- `updateTag` de `next/cache` → `vi.fn()`
- `unauthorized` de `next/navigation` → `vi.fn()` que lanza error

---

### `createEvent` — `__tests__/actions/createEvent.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Sin sesión | `auth()` → `null` | llama `unauthorized()` |
| 2 | Datos inválidos (título vacío) | sesión OK, FormData sin title | retorna `{ success: false, error: "Failed to create event" }` |
| 3 | Datos válidos, evento creado | sesión OK, `prisma.event.create` → evento mock | retorna `{ success: true, eventId: "mock-id" }` |
| 4 | `isPublic` checkbox "on" → `true` en DB | sesión OK, checkbox = "on" | `prisma.event.create` llamado con `isPublic: true` |
| 5 | `isPublic` ausente → `false` en DB | sesión OK, sin checkbox | `prisma.event.create` llamado con `isPublic: false` |
| 6 | `maxAttendees` vacío → `null` en DB | `maxAttendees: ""` | `prisma.event.create` llamado con `maxAttendees: null` |
| 7 | Prisma lanza error | `prisma.event.create` throws | retorna `{ success: false }` sin throw |
| 8 | **Bug conocido**: NO llama `updateTag("events")` | sesión OK, datos válidos | `updateTag` **no** es llamado (documentar como bug pendiente) |

---

### `deleteEvent` — `__tests__/actions/deleteEvent.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Sin sesión | `auth()` → `null` | llama `unauthorized()` |
| 2 | Evento no existe | `prisma.event.findUnique` → `null` | retorna `{ success: false, error: "Event not found" }` |
| 3 | Usuario no es propietario | evento con `userId: "other-user"` | retorna `{ success: false, error: "Not authorized to delete this event" }` |
| 4 | Borrado exitoso | usuario es propietario | `prisma.event.delete` llamado, retorna `{ success: true }` |
| 5 | Borrado exitoso invalida caché | usuario es propietario | `updateTag("events")` llamado |
| 6 | Prisma.delete lanza error | `prisma.event.delete` throws | retorna `{ success: false, error: "Failed to delete the event" }` |

---

### `updateEvent` — `__tests__/actions/updateEvent.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Sin sesión | `auth()` → `null` | llama `unauthorized()` |
| 2 | Evento no existe | `findUnique` → `null` | retorna `{ success: false, error: "Event not found" }` |
| 3 | Usuario no es propietario | evento con otro `userId` | retorna `{ success: false, error: "Not authorized to edit this event" }` |
| 4 | Datos inválidos | título vacío | retorna `{ success: false }` |
| 5 | Update exitoso | usuario es propietario + datos válidos | `prisma.event.update` llamado con datos correctos |
| 6 | Invalida ambos tags | update OK | `updateTag("events")` Y `updateTag("event-{id}")` llamados |
| 7 | `isPublic` toggle funciona | checkbox ausente en update | `prisma.event.update` con `isPublic: false` |

---

### `rsvpToEvent` — `__tests__/actions/rsvpToEvent.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Sin sesión | `auth()` → `null` | llama `unauthorized()` |
| 2 | Evento no existe | `findUnique(event)` → `null` | retorna `{ success: false, error: "Event not found" }` |
| 3 | Evento privado | `event.isPublic = false` | retorna `{ success: false, error: "Cannot RSVP to private events" }` |
| 4 | Evento pasado | `event.date` < now | retorna `{ success: false, error: "Cannot RSVP to past events" }` |
| 5 | RSVP nuevo (no existía) | `findUnique(rsvp)` → `null` | `prisma.rSVP.create` llamado |
| 6 | RSVP actualizado (ya existía) | `findUnique(rsvp)` → rsvp existente | `prisma.rSVP.update` llamado, NO create |
| 7 | Invalida 3 tags | RSVP exitoso | `updateTag("events")`, `updateTag("event-{id}")`, `updateTag("rsvps")` |
| 8 | Los 3 estados válidos | status = GOING / MAYBE / NOT_GOING | retorna `{ success: true }` en los 3 casos |

---

## Nivel 3 — Integration tests: API Routes

Mockear `prisma` y `auth`. Crear un `Request` de Next.js con `new Request(url)`.

---

### `GET /api/events` — `__tests__/api/events.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Sin filtros | `prisma.event.findMany` → lista | 200, array de eventos |
| 2 | `?search=term` | cualquier data | `prisma.event.findMany` llamado con `OR` en where |
| 3 | `?filter=upcoming` | cualquier data | where incluye `date: { gte: ... }` |
| 4 | `?filter=past` | cualquier data | where incluye `date: { lt: ... }` |
| 5 | Sin filtro → sin where de fecha | sin params | where NO tiene `date` |
| 6 | Prisma lanza error | findMany throws | 500, `{ error: "Failed to fetch events" }` |

---

### `GET /api/events/[eventId]` — `__tests__/api/eventById.test.ts`

| # | Escenario | Setup | Assert |
|---|-----------|-------|--------|
| 1 | Evento no encontrado | `findUnique` → `null` | 404, `{ error: "Event Not Found" }` |
| 2 | Evento público, sin auth | `isPublic: true`, `auth()` → `null` | 200, evento completo |
| 3 | Evento público, con auth | `isPublic: true`, sesión OK | 200, evento completo |
| 4 | Evento privado, sin auth | `isPublic: false`, `auth()` → `null` | 403 |
| 5 | Evento privado, otro usuario | `isPublic: false`, sesión de otro usuario | 403 |
| 6 | Evento privado, propietario | `isPublic: false`, sesión del propietario | 200, evento completo |
| 7 | Prisma lanza error | `findUnique` throws | 500 |

---

## Nivel 4 — Component tests (RTL)

---

### `EventList` — `__tests__/components/EventList.test.tsx`

Mock necesario: `next/navigation` (`useRouter`).

| # | Escenario | Assert |
|---|-----------|--------|
| 1 | Lista vacía + no autenticado | muestra "No events found", NO muestra "Create the first event" |
| 2 | Lista vacía + autenticado | muestra "No events found" Y link "Create the first event" |
| 3 | Lista con eventos | renderiza `n` tarjetas con título, descripción, fecha, ubicación |
| 4 | Títulos de cards son `<h2>` | `getAllByRole("heading", { level: 2 })` retorna los títulos |
| 5 | Link "View Details" apunta a `/events/{id}` | `getByRole("link", { name: /View Details/ })` tiene `href` correcto |
| 6 | Búsqueda llama a `router.push` con params | userEvent + submit form → `router.push` llamado con `?search=...` |
| 7 | Filtro "Upcoming" llama a `router.push` | select + submit → `router.push` con `?filter=upcoming` |

---

### `RSVPButtons` — `__tests__/components/RSVPButtons.test.tsx`

Mock necesario: `lib/event-actions` (`rsvpToEvent`).

| # | Escenario | Assert |
|---|-----------|--------|
| 1 | Render base | 3 botones visibles: "Going", "Maybe", "Not going" |
| 2 | Heading es `<h2>` | `getByRole("heading", { level: 2, name: /RSVP/i })` existe |
| 3 | Sin RSVP actual | ningún botón tiene clase de "activo" (fondo sólido) |
| 4 | `currentRSVP="GOING"` | botón "Going" tiene clase activa, los otros no |
| 5 | Click "Going" llama `rsvpToEvent(eventId, "GOING")` | userEvent.click + assert mock |
| 6 | Click "Maybe" llama `rsvpToEvent(eventId, "MAYBE")` | idem |
| 7 | Botones deshabilitados durante loading | tras click, todos los botones tienen `disabled` |

---

### `EventForm` — `__tests__/components/EventForm.test.tsx`

Mock necesario: `next/navigation` (`useRouter`), server actions (`createEvent`, `updateEvent`).

| # | Escenario | Assert |
|---|-----------|--------|
| 1 | Modo creación: heading "Create New Event" | `getByRole("heading", { name: /Create New Event/ })` |
| 2 | Modo edición: heading "Edit Event" | prop `event` → `getByRole("heading", { name: /Edit Event/ })` |
| 3 | Campos vacíos en creación | todos los inputs vacíos / defaults |
| 4 | Campos pre-rellenados en edición | cada input tiene el valor del evento pasado como prop |
| 5 | Error de server action se muestra | state con `error: "..."` → texto visible en pantalla |
| 6 | Submit en creación llama `createEvent` | userEvent.type + submit → `createEvent` llamada |
| 7 | Checkbox `isPublic` checked por defecto en creación | `getByRole("checkbox", { name: /public/i })` tiene `checked: true` |
| 8 | `isPublic` respeta valor del evento en edición | evento con `isPublic: false` → checkbox sin marcar |

---

### `EventActions` — `__tests__/components/EventActions.test.tsx`

Mock necesario: `next/navigation`, server action `deleteEvent`.

| # | Escenario | Assert |
|---|-----------|--------|
| 1 | Renderiza botón "Edit" y botón "Delete" | ambos visibles |
| 2 | Link "Edit" apunta a `/events/{id}/edit` | `href` correcto |
| 3 | Click "Delete" llama `deleteEvent(eventId)` | userEvent.click + assert mock |

---

### `Navbar` — `__tests__/components/Navbar.test.tsx`

Mock necesario: `next/navigation`. El componente recibe `session` como prop.

| # | Escenario | Assert |
|---|-----------|--------|
| 1 | Sin sesión | link "Sign In" visible, NO "Dashboard" |
| 2 | Con sesión | link "Dashboard" visible, NO "Sign In" |
| 3 | Con sesión muestra nombre de usuario | `session.user.name` visible en el Navbar |
| 4 | Link de logo apunta a `/` | `href="/"` |

---

## Bugs conocidos a documentar con tests

> Estos tests **fallarán intencionadamente** al escribirlos. Documentan bugs existentes para corregir después.

| Bug | Test que lo detecta | Descripción |
|-----|---------------------|-------------|
| `createEvent` no invalida caché | `createEvent.test.ts` #8 | Tras crear un evento, `updateTag("events")` nunca se llama → la lista de `/events` no se refresca |

---

## Prioridad de implementación

```
Alta     eventSchema          → Pure unit, máximo ROI, cero setup
Alta     rsvpToEvent          → Lógica más compleja (5 guards + upsert)
Alta     GET /events/[id]     → Autorización crítica (evento privado)
Media    createEvent          → Documenta bug de caché
Media    RSVPButtons          → Componente con estado async
Media    EventForm            → Formulario más complejo de la app
Baja     EventList            → Mainly presentacional
Baja     Navbar / EventActions → Simples, bajo riesgo
```

---

## Cobertura objetivo (fase 1)

| Capa | Objetivo |
|------|----------|
| Lógica de validación | 100% |
| Server actions | 80%+ (todos los branches de autorización) |
| API routes | 80%+ (todos los códigos de respuesta) |
| Componentes | 70%+ (caminos feliz + error state) |
