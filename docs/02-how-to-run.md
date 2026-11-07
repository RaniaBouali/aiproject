# Run the website on Windows

## 1. Install the tools

1. Install Node.js 20 or newer.
2. Install XAMPP.
3. Open PowerShell in the project folder.
4. Confirm Node and npm are available:

```powershell
node --version
npm --version
```

## 2. Start MySQL and create the database

1. Open the XAMPP Control Panel.
2. Click **Start** next to **MySQL**. The row should turn green.
3. Open `http://localhost/phpmyadmin`.
4. Create a database named `proxiservice`.
5. Choose `utf8mb4_unicode_ci` as its collation.
6. Check the port from PowerShell:

```powershell
Test-NetConnection localhost -Port 3306
```

`TcpTestSucceeded` should be `True`.

## 3. Configure the environment

1. Copy the example file:

```powershell
Copy-Item .env.example .env
```

2. Generate a new signing secret. This command prints a random value:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

3. Open `.env` in a text editor. Keep the sample `DATABASE_URL` if XAMPP uses its default root account and empty password. Paste the generated value after `SESSION_SECRET=`.
4. Save `.env`. Do not commit it or share the signing secret.

The example database URL is `mysql://root:@localhost:3306/proxiservice`. The code fails closed if the session secret is missing or shorter than 32 characters.

## 4. Install, migrate, and seed

Run these commands in order:

```powershell
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
```

Prisma 7 does not automatically run the seed after migration. Run `db:seed` explicitly.

## 5. Start and sign in

```powershell
npm run dev
```

Open `http://localhost:3000`.

| Role | Email | Password |
|---|---|---|
| Client | `client@proxiservice.tn` | `Demo1234` |
| Provider (plumber in Ben Arous) | `provider@proxiservice.tn` | `Demo1234` |

The provider account has two pending bookings.

## Checks

Run `npm test`, `npx tsc --noEmit`, and `npm run build`. Open `/api/auth/me` while signed in to check the session. It should return the current user. Sign out and reload it; it should return `401`.

If port 3000 is occupied, run `npm run dev -- -p 3001` and open port 3001. The map loads OpenStreetMap tiles over the internet.
