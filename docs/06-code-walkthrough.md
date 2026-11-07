# Code walkthrough

## Main files

| File or folder | What it does |
|---|---|
| `prisma/schema.prisma` | Declares MySQL tables, enums, relations, and indexes. |
| `prisma/migrations/` | Stores SQL migrations tracked by the project. |
| `prisma/seed.ts` | Upserts the six categories, 25 providers, 10 clients, schedules, demo bookings, and reviews. |
| `prisma.config.ts` | Tells Prisma where the schema and migrations are and how to seed. |
| `src/server/db.ts` | Creates one Prisma client with the Prisma 7 MariaDB driver adapter. |
| `src/server/auth.ts` | Signs and verifies JWTs and sets the HttpOnly cookie. |
| `src/server/session-constants.ts` | Shares the cookie name without importing database code into middleware. |
| `src/server/services/serializers.ts` | Maps Prisma rows into the shapes used by the UI. It also derives initials and distances. |
| `middleware.ts` | Checks signed role claims before protected client and provider pages load. APIs check the database user again. |
| `src/app/api/**/route.ts` | Validates HTTP input, checks access, calls Prisma, and returns JSON. |
| `src/lib/auth-client.ts` | Fetches `/api/auth/me` and sends logout requests. It does not store a token. |
| `src/lib/geo.ts` | Calculates distances and provides a Tunis fallback coordinate. |
| `src/components/MapComponent.tsx` | Builds Leaflet maps and reports a clicked map coordinate to registration. |
| `src/app/register/page.tsx` | Signup form, map pin, address label, services, and portfolio inputs. |
| `src/app/login/page.tsx` | Login form and seeded demo account shortcuts. |
| `src/app/search/page.tsx` | Fetches categories and providers from the API and renders map/list results. |
| `src/components/BookingModal.tsx` | Collects a service, time, address, and booking notes; posts to the booking API. |
| `tests/routes.test.ts` | Exercises route handlers using HTTP requests and a mocked Prisma client. |

## Booking price example

1. `BookingModal` sends `serviceId` and the requested time.
2. `src/app/api/bookings/route.ts` validates the fields with Zod.
3. It looks up the service row by ID and checks the service belongs to the chosen provider.
4. It copies `price` and `priceType` from that database row into the booking snapshot.
5. `toBooking` in `src/server/services/serializers.ts` converts Prisma Decimal and dates into JSON values for the screen.

The client may display a price, but its request cannot set the saved booking price.
