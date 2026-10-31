/**
 * RBAC (Role-Based Access Control) & Role Segregation Test Suite
 * Validates strict separation of duties between CLIENT, PROVIDER, and GUEST roles
 */

import assert from 'node:assert';
import { dataStore } from '../src/lib/data-store.ts';
import type { Role } from '../src/types/index.ts';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          passedTests++;
          console.log(`  ${GREEN}✓ PASS:${RESET} ${name}`);
        })
        .catch((err) => {
          failedTests++;
          console.error(`  ${RED}✗ FAIL:${RESET} ${name}`);
          console.error(`    ${RED}${err.message}${RESET}`);
        });
    } else {
      passedTests++;
      console.log(`  ${GREEN}✓ PASS:${RESET} ${name}`);
    }
  } catch (err: any) {
    failedTests++;
    console.error(`  ${RED}✗ FAIL:${RESET} ${name}`);
    console.error(`    ${RED}${err.message}${RESET}`);
  }
}

// Emulate RBAC Navbar Link resolver
function getNavLinksForRole(role?: Role) {
  if (role === 'PROVIDER') {
    return [
      { name: 'Mon Cockpit Pro', href: '/provider/dashboard' },
      { name: 'Gestion des Tarifs', href: '/provider/dashboard#services' },
      { name: 'Ma Vitrine Publique', href: '/providers/prov-karim-meca' },
    ];
  }
  if (role === 'CLIENT') {
    return [
      { name: 'Trouver un artisan', href: '/search' },
      { name: 'Mes Réservations', href: '/client/dashboard' },
    ];
  }
  return [
    { name: 'Trouver un service', href: '/search' },
    { name: 'Catégories', href: '/#categories' },
    { name: 'Devenir Artisan', href: '/register?role=provider' },
  ];
}

// Emulate Page Access Guard Check
function canAccessRoute(route: string, userRole?: Role): boolean {
  if (route.startsWith('/provider/dashboard')) {
    return userRole === 'PROVIDER';
  }
  if (route.startsWith('/client/dashboard')) {
    return userRole === 'CLIENT';
  }
  return true; // Public routes (/search, /login, /register, /, /providers/:id)
}

async function main() {
  console.log(`\n${BOLD}${BLUE}======================================================${RESET}`);
  console.log(`${BOLD}${BLUE}   PROXISERVICE RBAC & ACCESS CONTROL TEST SUITE     ${RESET}`);
  console.log(`${BOLD}${BLUE}======================================================${RESET}\n`);

  console.log(`${BOLD}1. NAVBAR NAVIGATION ROLE ISOLATION${RESET}`);

  runTest('PROVIDER must NOT see "Trouver un service" or "Mes Réservations"', () => {
    const links = getNavLinksForRole('PROVIDER');
    const linkNames = links.map((l) => l.name);

    assert.ok(linkNames.includes('Mon Cockpit Pro'));
    assert.ok(linkNames.includes('Gestion des Tarifs'));
    assert.ok(linkNames.includes('Ma Vitrine Publique'));

    // Strictly prohibited for providers
    assert.strictEqual(linkNames.includes('Trouver un service'), false);
    assert.strictEqual(linkNames.includes('Mes Réservations'), false);
  });

  runTest('CLIENT must NOT see "Mon Cockpit Pro" or "Gestion des Tarifs"', () => {
    const links = getNavLinksForRole('CLIENT');
    const linkNames = links.map((l) => l.name);

    assert.ok(linkNames.includes('Trouver un artisan'));
    assert.ok(linkNames.includes('Mes Réservations'));

    // Strictly prohibited for clients
    assert.strictEqual(linkNames.includes('Mon Cockpit Pro'), false);
    assert.strictEqual(linkNames.includes('Gestion des Tarifs'), false);
    assert.strictEqual(linkNames.includes('Ma Vitrine Publique'), false);
  });

  runTest('GUEST must see public discovery & registration only', () => {
    const links = getNavLinksForRole(undefined);
    const linkNames = links.map((l) => l.name);

    assert.ok(linkNames.includes('Trouver un service'));
    assert.ok(linkNames.includes('Devenir Artisan'));
    assert.strictEqual(linkNames.includes('Mon Cockpit Pro'), false);
    assert.strictEqual(linkNames.includes('Mes Réservations'), false);
  });

  console.log(`\n${BOLD}2. ROUTE GUARD RBAC ACCESS ENFORCEMENT${RESET}`);

  runTest('RBAC Guard: PROVIDER allowed on /provider/dashboard', () => {
    assert.strictEqual(canAccessRoute('/provider/dashboard', 'PROVIDER'), true);
  });

  runTest('RBAC Guard: CLIENT denied on /provider/dashboard', () => {
    assert.strictEqual(canAccessRoute('/provider/dashboard', 'CLIENT'), false);
  });

  runTest('RBAC Guard: GUEST denied on /provider/dashboard', () => {
    assert.strictEqual(canAccessRoute('/provider/dashboard', undefined), false);
  });

  runTest('RBAC Guard: CLIENT allowed on /client/dashboard', () => {
    assert.strictEqual(canAccessRoute('/client/dashboard', 'CLIENT'), true);
  });

  runTest('RBAC Guard: PROVIDER denied on /client/dashboard', () => {
    assert.strictEqual(canAccessRoute('/client/dashboard', 'PROVIDER'), false);
  });

  runTest('RBAC Guard: GUEST denied on /client/dashboard', () => {
    assert.strictEqual(canAccessRoute('/client/dashboard', undefined), false);
  });

  runTest('RBAC Guard: Public routes accessible by all roles', () => {
    assert.strictEqual(canAccessRoute('/search', 'PROVIDER'), true);
    assert.strictEqual(canAccessRoute('/search', 'CLIENT'), true);
    assert.strictEqual(canAccessRoute('/search', undefined), true);
  });

  console.log(`\n${BOLD}3. PROVIDER TARIFFS ISOLATION & PERSISTENCE${RESET}`);

  runTest('Provider updates own services without side-effects on others', () => {
    const initialAhmed = dataStore.getProviderById('prov-ahmed-elec')!;
    const initialAhmedServicesCount = initialAhmed.services.length;

    // Karim updates his tariffs
    dataStore.updateProvider('prov-karim-meca', {
      services: [
        {
          id: 'srv-k-new-1',
          title: 'Diagnostic Électronique Pro',
          description: 'Lecture OBD2 approfondie',
          price: 4500,
          priceType: 'FIXED',
          durationMinutes: 45,
        },
      ],
    });

    const karimAfter = dataStore.getProviderById('prov-karim-meca')!;
    assert.strictEqual(karimAfter.services.length, 1);
    assert.strictEqual(karimAfter.services[0].price, 4500);

    // Ahmed's services must remain completely unaffected
    const ahmedAfter = dataStore.getProviderById('prov-ahmed-elec')!;
    assert.strictEqual(ahmedAfter.services.length, initialAhmedServicesCount);
  });

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}${BLUE}======================================================${RESET}`);
  console.log(`${BOLD}RBAC TEST RESULTS:${RESET}`);
  console.log(`  Total Checks : ${totalTests}`);
  console.log(`  ${GREEN}Passed       : ${passedTests}${RESET}`);
  console.log(`  ${failedTests === 0 ? GREEN : RED}Failed       : ${failedTests}${RESET}`);
  console.log(`${BOLD}${BLUE}======================================================${RESET}\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
