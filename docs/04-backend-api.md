# Backend API

Handlers are in `src/app/api/**/route.ts`. They use Zod, Prisma, and the signed `proxiservice_session` HttpOnly cookie. Private handlers verify the current database user and role. Mutations verify record ownership.

| Method and path | Who can call | Input and result |
|---|---|---|
| `POST /api/auth/register` | Anyone | Name, email, phone, password, role, address label and coordinates. Provider signup also sends a category, profile fields, services, and portfolio entries. Returns `201` and sets the cookie. Invalid data is `400`; duplicate email is `409`. |
| `POST /api/auth/login` | Anyone | Email and password. Compares the bcrypt hash. Returns user details and sets an HttpOnly cookie. Invalid credentials are `401`; invalid input is `400`. No JWT is returned to JavaScript. |
| `GET /api/auth/me` | Signed-in user | No body. Returns the current user and provider profile, or `401`. |
| `POST /api/auth/logout` | Anyone | No body. Clears the session cookie. |
| `POST /api/analyses` | Signed-in client | Stores the AI conversation and creates an analysis record when the result is ready. |
| `PATCH /api/analyses/:id` | Owning client | Confirms an analyzed request before matching and booking. |
| `GET /api/categories` | Public | No inputs. Returns categories and provider counts. |
| `GET /api/providers/search` | Signed-in client with confirmed analysis | Requires `analysisId`; category and urgency come from the owned confirmed analysis. |
| `GET /api/providers/:id` | Public | Provider ID in the URL. Returns a public profile or `404`. |
| `PUT /api/providers/:id` | Owning provider | Optional `bio`, `experienceYears`, `radiusKm`, and service edits. Strict Zod schema rejects extra fields. Other roles or owners get `403`; invalid input is `400`. Service IDs are checked against the owner's profile. |
| `GET /api/bookings` | Signed-in client or provider | No body. Returns only bookings for the signed-in client or provider. |
| `POST /api/bookings` | Client with confirmed analysis | Requires an owned confirmed `analysisId`; the server verifies the service category matches the analysis before creating the booking. |
| `PATCH /api/bookings/:id` | Booking client or provider | `{ "status": "..." }`. The client can cancel their pending or accepted booking. The provider can accept or reject pending requests, start accepted work, and complete in-progress work. Non-participants get `403`; invalid transitions are `400`; unknown booking is `404`. |
| `POST /api/reviews` | Client who owns a completed booking | Booking ID, rating from 1 to 5, and comment. Provider and client IDs come from the booking and session. One review per booking. Unowned records get `403`; incomplete bookings or invalid values are `400`; duplicates are `409`. |

Zod schemas and route functions are in each route file. Shared session helpers are in `src/server/auth.ts`; Prisma is initialized in `src/server/db.ts`; response mapping is in `src/server/services/serializers.ts`.

Route-handler tests are in `tests/routes.test.ts` and run with Vitest.
