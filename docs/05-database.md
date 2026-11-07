# Database

Prisma schema: `prisma/schema.prisma`. The initial MySQL migration is `prisma/migrations/20261107000000_init/migration.sql`. The repeatable seed is `prisma/seed.ts`.

## Tables and fields

| Table | Fields |
|---|---|
| `User` | `id` VARCHAR(30) PK; `name` VARCHAR(120); `email` VARCHAR(254) unique; `phone` VARCHAR(30); `passwordHash` VARCHAR(255); `role` CLIENT/PROVIDER; `lat`, `lng` nullable DOUBLE; `addressLabel` nullable VARCHAR(255); `createdAt`, `updatedAt` DATETIME. |
| `Category` | `id` VARCHAR(30) PK; `slug` VARCHAR(80) unique; `name` VARCHAR(100); `icon` VARCHAR(60); `createdAt` DATETIME. |
| `Provider` | `id` VARCHAR(30) PK; `userId` VARCHAR(30) unique FK to User; `bio` TEXT; `experienceYears`, `radiusKm`, `ratingCount`, `jobsDone` INT; `ratingAvg` DOUBLE; `verified` BOOLEAN; timestamps. |
| `ProviderCategory` | `providerId` and `categoryId` form the composite PK and reference Provider and Category. |
| `Service` | `id` VARCHAR(30) PK; `providerId`, `categoryId` FKs; `title` VARCHAR(140); `description` TEXT; `price` DECIMAL(10,3) TND; `priceType` FIXED/HOURLY/ESTIMATE; `durationMin` INT default 60; `active` BOOLEAN; timestamps. |
| `PortfolioItem` | `id` VARCHAR(30) PK; `providerId` FK; `title` VARCHAR(140); `description` TEXT; `createdAt` DATETIME. |
| `Availability` | `id` VARCHAR(30) PK; `providerId` FK; `weekday` INT (0 Sunday to 6 Saturday); `startTime`, `endTime` VARCHAR(5). Unique provider, weekday, and start time. |
| `Booking` | `id` VARCHAR(30) PK; `clientId` FK to User; `providerId` FK to Provider; `serviceId` FK; `startAt`, `endAt` DATETIME; `address` VARCHAR(255); `lat`, `lng` DOUBLE; `notes` TEXT; `problemSummary` VARCHAR(255); `price` DECIMAL(10,3) and `priceType` snapshots; `status` enum; timestamps. |
| `Review` | `id` VARCHAR(30) PK; `bookingId` unique FK; `clientId` FK to User; `providerId` FK; `rating` INT; `comment` TEXT; `createdAt` DATETIME. |
| `ProblemAnalysis` | `id` VARCHAR(30) PK; `clientId` FK; status; confirmed category, urgency, summary, messages JSON, confirmation and timestamps. |

## Relations

```text
User 1 ── 0..1 Provider
User 1 ── many Booking (as client)
Provider 1 ── many Booking
Provider many ── many Category (through ProviderCategory)
Provider 1 ── many Service, PortfolioItem, Availability, Review
Category 1 ── many Service
Booking 1 ── 0..1 Review
User 1 ── many Review (as client)
User 1 ── many ProblemAnalysis
ProblemAnalysis 1 ── many Booking
Service 1 ── many Booking
```

Foreign keys use cascade deletes for a provider's categories, services, portfolio, availability, and reviews. Bookings restrict deletion of their user, provider, and service records. Reviews cascade with their booking. Indexes cover roles and user coordinates, provider rating and verification, category/provider links, active services, availability, booking lookups, and provider review history.

## Where data is used

| Table | Code |
|---|---|
| User | `src/server/auth.ts`, auth routes, booking routes, `prisma/seed.ts`. |
| Category | category/search APIs, registration, provider/service relations, seed. |
| Provider and ProviderCategory | provider search/profile APIs, provider dashboard APIs, booking and review logic, seed. |
| Service | registration, provider edits, provider search/profile, booking creation, seed. |
| PortfolioItem | registration, public provider profile, seed. |
| Availability | provider registration and seed. |
| Booking | booking APIs, client/provider dashboards, review eligibility, seed. |
| Review | review API, public provider page, provider rating totals, seed. |

Passwords are bcrypt hashes. Booking price snapshots come from the stored Service row, not the booking request body.
