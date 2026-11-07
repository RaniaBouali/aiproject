# How to change the project

| To change | Edit |
|---|---|
| Shared colors | `tailwind.config.ts`, `src/app/globals.css` |
| Page text/layout | The matching `src/app/**/page.tsx` file |
| Shared UI | `src/components/` |
| Demo data | `src/lib/data-store.ts` |
| Types | `src/types/index.ts` |
| Haversine/default search location | `src/lib/geo.ts` |
| API behavior | Matching `src/app/api/**/route.ts` file |

For a new page, add `src/app/<route>/page.tsx`. For a new API endpoint, add `src/app/api/<name>/route.ts`, validate input with Zod, check the server session/role/ownership, and put business rules in `src/server/services`. For a new persisted field, update the Prisma model, create a migration, update the service and validation schema, then update the UI and tests.
