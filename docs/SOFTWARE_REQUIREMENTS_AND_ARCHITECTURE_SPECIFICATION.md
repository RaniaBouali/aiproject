# ProxiService requirements and architecture

## Product

ProxiService connects customers in Greater Tunis with local service professionals. Customers search by service and distance, view provider profiles, request bookings, and leave reviews. Providers manage requests, services, and coverage areas.

## Project target

| Area | Target |
|---|---|
| Web app | Keep the current Next.js 14 App Router, TypeScript, and Tailwind versions |
| Data | Prisma 7 with MySQL from local XAMPP, port 3306, root user with an empty password |
| Validation and security | Zod, bcrypt, and JWT stored in an HttpOnly cookie |
| Map | Leaflet and OpenStreetMap |
| Tests | Vitest |
| Locale | English UI; Tunisia / Greater Tunis; TND; `Africa/Tunis` |

These are project targets. The current app still uses an in-memory store, local-storage sessions, and Node test scripts. Prisma, MySQL persistence, Zod validation, bcrypt, server sessions, and Vitest are not implemented yet.

## Core flows

1. A customer or provider registers and chooses a role.
2. A customer searches providers by keyword, category, rating, and distance.
3. A customer requests a service at a chosen date and time.
4. A provider accepts, rejects, or completes a request.
5. A customer can submit a review.

## Security requirements

- Every private API route must verify the session, role, and record ownership on the server.
- Validate request input with Zod.
- Derive service prices from trusted database records.
- Store password hashes with bcrypt.
- Store signed session JWTs in HttpOnly cookies.

## Data model target

The existing domain has users, provider profiles, categories, services, portfolio items, bookings, and reviews. Define Prisma relations and constraints before connecting these models to the API.

## Current limitations

Current routes call `src/lib/data-store.ts`, which keeps data in memory. The UI role guard is client-side only. Current API handlers do not verify a signed session or ownership. Current tests do not exercise HTTP routes in a browser. Do not treat the current demo as production-secure or persistent.
