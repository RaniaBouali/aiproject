# Pages

| Flow | URL | Access | Main content and actions |
|---:|---|---|---|
| 1 | `/` | Public | Search form, category links, provider cards, location button. Uses seed data. |
| 2 | `/search?analysisId=...` | Signed-in client with confirmed analysis | Filters and map/list results for the confirmed request. |
| 3 | `/providers/[id]` | Public profile; booking requires a confirmed client analysis | Provider details, services, portfolio, reviews, and gated booking. |
| 4 | `/register` | Public | Customer/provider form. Sends `POST /api/auth/register`. |
| 5 | `/login` | Public | Demo login form. Sends `POST /api/auth/login`. |
| 6 | `/client/dashboard` | Signed-in client | Booking list and review action. Links to the protected new-request flow. |
| 7 | `/client/request/new` | Signed-in client | AI problem analysis, result confirmation, and transition to matching. |
| 8 | `/provider/dashboard` | Signed-in provider | Request actions, service editing, coverage settings. Calls provider and booking APIs. |

Shared layout is in `src/app/layout.tsx`; navigation and footer are in `src/components`. Middleware and server APIs enforce authentication, role, ownership, and confirmed-analysis requirements.
