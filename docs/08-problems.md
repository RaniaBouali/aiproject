# Current problems

| Priority | Problem | Location | Next fix |
|---|---|---|---|
| Critical | Plain-text passwords and predictable demo tokens | `src/lib/data-store.ts` | Hash passwords and use signed server sessions. |
| Critical | API handlers do not verify identity, role, or ownership | `src/app/api/**` | Add server session and authorization helpers to each handler. |
| High | Data exists only in process memory | `src/lib/data-store.ts` | Add Prisma 7 models, migrations, and MySQL repositories. |
| High | Booking GET returns all bookings; input fields and prices are trusted | `src/app/api/bookings/route.ts` | Filter by session, validate with Zod, load prices from the database. |
| High | Provider update accepts arbitrary properties | `src/app/api/providers/[id]/route.ts` | Whitelist fields and check ownership. |
| Medium | Review range and booking eligibility are not checked | `src/app/api/reviews/route.ts` | Validate rating and completed booking ownership. |
| Medium | Demo seed content was originally for another country/language | `src/lib/data-store.ts` | Keep all seed text and locations aligned with English and Greater Tunis. |
| Medium | Tests are Node scripts, not Vitest or HTTP/browser tests | `tests/`, `package.json` | Migrate tests and cover route authorization. |
