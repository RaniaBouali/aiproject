# Overview

ProxiService is a local-services marketplace. Customers find providers, view services, request bookings, and write reviews. Providers handle requests and edit their services.

| Role | Main area |
|---|---|
| Guest | Home, search, profiles, registration and login |
| Customer | `/client/dashboard` |
| Provider | `/provider/dashboard` |

The stack is Next.js 14 App Router and React for pages, TypeScript for types, and Tailwind CSS for styling. Prisma 7 with its MariaDB driver adapter connects to XAMPP MySQL. Zod validates requests, bcrypt hashes passwords, and `jose` signs JWTs stored in HttpOnly cookies. Leaflet renders OpenStreetMap maps. Vitest tests the HTTP route handlers.

| Folder | Purpose |
|---|---|
| `src/app` | Pages, shared layout, styles, and API routes |
| `src/components` | Shared navigation, cards, map, guards, and dialogs |
| `src/lib` | Browser session fetch helper, geospatial math, and shared UI types |
| `src/server` | Prisma client, cookie/JWT session checks, and response mapping |
| `prisma` | MySQL schema, migration, and repeatable demo seed |
| `src/types` | Shared TypeScript types |
| `public` | Static files |
| `tests` | Vitest HTTP route-handler tests |
| `docs` | Project documentation |

Root config includes `package.json`, `package-lock.json`, `prisma.config.ts`, `vitest.config.ts`, TypeScript, Next.js, Tailwind, and PostCSS settings. Copy `.env.example` to `.env` for local secrets and connection settings.
