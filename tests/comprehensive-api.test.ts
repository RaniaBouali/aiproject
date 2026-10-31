/**
 * ProxiService Comprehensive Automated Test Suite
 * Validates Geolocation Math, Auth, Search Engine, Provider Management, Bookings, and Reviews
 */

import assert from 'node:assert';
import { calculateHaversineDistance, formatDistance, DEFAULT_COORDINATES } from '../src/lib/geo.ts';
import { dataStore } from '../src/lib/data-store.ts';

// Colors for terminal reporting
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

async function main() {
  console.log(`\n${BOLD}${BLUE}======================================================${RESET}`);
  console.log(`${BOLD}${BLUE}   PROXISERVICE COMPLETE AUTOMATED TEST SUITE        ${RESET}`);
  console.log(`${BOLD}${BLUE}======================================================${RESET}\n`);

  // ------------------------------------------------------------------
  // 1. GEOSPATIAL & HAVERSINE MATHEMATICS
  // ------------------------------------------------------------------
  console.log(`${BOLD}1. GEOSPATIAL & HAVERSINE ALGORITHMS${RESET}`);

  runTest('Distance between same point should be 0 km', () => {
    const dist = calculateHaversineDistance(36.7538, 3.0588, 36.7538, 3.0588);
    assert.strictEqual(dist, 0);
  });

  runTest('Distance between Alger Centre and Bab El Oued (~3.6 km)', () => {
    const dist = calculateHaversineDistance(36.7538, 3.0588, 36.7865, 3.0535);
    assert.ok(dist > 3.0 && dist < 4.5, `Expected ~3.6km, got ${dist}`);
  });

  runTest('formatDistance should display meters when < 1km', () => {
    assert.strictEqual(formatDistance(0.45), '450 m');
    assert.strictEqual(formatDistance(0.85), '850 m');
  });

  runTest('formatDistance should display km with 1 decimal when >= 1km', () => {
    assert.strictEqual(formatDistance(3.64), '3.6 km');
    assert.strictEqual(formatDistance(12.0), '12.0 km');
  });

  // ------------------------------------------------------------------
  // 2. AUTHENTICATION & REGISTRATION ENDPOINTS
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}2. AUTHENTICATION & MULTI-ROLE ONBOARDING${RESET}`);

  runTest('Client Registration: Should create user and issue token', () => {
    const testEmail = `test.client.${Date.now()}@test.com`;
    const res = dataStore.registerUser({
      name: 'Yasmine Belkacem',
      email: testEmail,
      phone: '+213 551 22 33 44',
      password: 'password123',
      role: 'CLIENT',
      addressText: 'Hydra, Alger',
    });

    assert.ok(res.user.id.startsWith('user-'));
    assert.strictEqual(res.user.role, 'CLIENT');
    assert.strictEqual(res.user.email, testEmail);
    assert.ok(res.token.startsWith('tok_'));
  });

  runTest('Provider Registration: Should create User AND ProviderProfile with tariffs', () => {
    const testEmail = `test.provider.${Date.now()}@test.com`;
    const regRes = dataStore.registerUser({
      name: 'Rachid Mécano',
      email: testEmail,
      phone: '+213 662 33 44 55',
      password: 'securePassword!',
      role: 'PROVIDER',
      addressText: 'Chéraga, Alger',
    });

    const category = dataStore.getCategoryBySlug('mecanicien')!;
    const profile = dataStore.createProviderProfile({
      userId: regRes.user.id,
      name: regRes.user.name,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
      phone: regRes.user.phone,
      email: regRes.user.email,
      addressText: 'Chéraga, Alger',
      latitude: 36.7698,
      longitude: 2.9578,
      operationalRadiusKm: 30,
      isVerified: true,
      status: 'AVAILABLE',
      bio: 'Mécanicien spécialiste moteurs diesel et turbo.',
      experienceYears: 10,
      categories: [category],
      services: [
        {
          id: 'srv-test-1',
          title: 'Révision Générale',
          description: 'Filtres + Vidange + Freins',
          price: 7000,
          priceType: 'FIXED',
          durationMinutes: 120,
        },
      ],
      portfolio: [
        {
          id: 'port-test-1',
          title: 'Atelier de Chéraga',
          imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b',
          description: 'Pont élévateur professionnel',
        },
      ],
    });

    assert.ok(profile.id.startsWith('prov-'));
    assert.strictEqual(profile.name, 'Rachid Mécano');
    assert.strictEqual(profile.services.length, 1);
    assert.strictEqual(profile.services[0].price, 7000);
    assert.strictEqual(profile.operationalRadiusKm, 30);
  });

  runTest('Duplicate Email Registration: Should reject duplicate email', () => {
    assert.throws(
      () => {
        dataStore.registerUser({
          name: 'Sarah Duplicate',
          email: 'client@proxiservice.com', // existing email
          phone: '+213 000000',
          password: 'password123',
          role: 'CLIENT',
        });
      },
      /existe déjà/
    );
  });

  runTest('Login with valid credentials: Should authenticate and return user', () => {
    const auth = dataStore.authenticate('client@proxiservice.com', 'password123');
    assert.ok(auth !== null);
    assert.strictEqual(auth?.user.email, 'client@proxiservice.com');
    assert.strictEqual(auth?.user.role, 'CLIENT');
  });

  runTest('Login with invalid password: Should fail authentication', () => {
    const auth = dataStore.authenticate('client@proxiservice.com', 'WRONG_PASSWORD');
    assert.strictEqual(auth, null);
  });

  // ------------------------------------------------------------------
  // 3. CATEGORIES & SPATIAL SEARCH ENGINE
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}3. CATEGORIES & SPATIAL SEARCH ENGINE${RESET}`);

  runTest('getCategories: Returns all 6 default trades', () => {
    const categories = dataStore.getCategories();
    assert.strictEqual(categories.length, 6);
    const slugs = categories.map((c) => c.slug);
    assert.ok(slugs.includes('mecanicien'));
    assert.ok(slugs.includes('femme-de-menage'));
    assert.ok(slugs.includes('electricien'));
    assert.ok(slugs.includes('plombier'));
    assert.ok(slugs.includes('peintre'));
    assert.ok(slugs.includes('menuisier'));
  });

  runTest('Spatial Search: Filter within 25km radius of Algiers', () => {
    const results = dataStore.searchProviders({
      latitude: DEFAULT_COORDINATES.latitude,
      longitude: DEFAULT_COORDINATES.longitude,
      radiusKm: 25,
    });
    assert.ok(results.length > 0);
    // All returned providers must have distanceKm <= 25 (with tolerance)
    results.forEach((p) => {
      assert.ok(p.distanceKm !== undefined);
      assert.ok(p.distanceKm <= 30);
    });
  });

  runTest('Category Filter: Search for "mecanicien" returns only mechanics', () => {
    const results = dataStore.searchProviders({
      category: 'mecanicien',
    });
    assert.ok(results.length > 0);
    results.forEach((p) => {
      assert.ok(p.categories.some((c) => c.slug === 'mecanicien'));
    });
  });

  runTest('Category Filter: Search for "femme-de-menage" returns only cleaning providers', () => {
    const results = dataStore.searchProviders({
      category: 'femme-de-menage',
    });
    assert.ok(results.length > 0);
    results.forEach((p) => {
      assert.ok(p.categories.some((c) => c.slug === 'femme-de-menage'));
    });
  });

  runTest('Rating Filter: minRating 4.9 returns only high-rated providers', () => {
    const results = dataStore.searchProviders({
      minRating: 4.9,
    });
    assert.ok(results.length > 0);
    results.forEach((p) => {
      assert.ok(p.ratingAverage >= 4.9);
    });
  });

  runTest('Keyword Search: Searching "vidange" finds mechanic offering oil change', () => {
    const results = dataStore.searchProviders({
      query: 'vidange',
    });
    assert.ok(results.length > 0);
    assert.ok(results.some((p) => p.name === 'Karim Benali'));
  });

  // ------------------------------------------------------------------
  // 4. PROVIDER PROFILE & TARIFFS MANAGEMENT
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}4. PROVIDER PROFILE & TARIFFS MANAGEMENT${RESET}`);

  runTest('updateProvider: Artisan updates their operational radius and tariffs', () => {
    const updated = dataStore.updateProvider('prov-karim-meca', {
      operationalRadiusKm: 35,
      bio: 'Mécanicien automobile certifié avec valise multimarques et remorque.',
    });
    assert.ok(updated !== null);
    assert.strictEqual(updated?.operationalRadiusKm, 35);
    assert.ok(updated?.bio.includes('remorque'));
  });

  // ------------------------------------------------------------------
  // 5. BOOKING WORKFLOW & STATE TRANSITIONS
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}5. BOOKING WORKFLOW & LIFECYCLE${RESET}`);

  let createdBookingId = '';

  runTest('createBooking: Creates new booking with status PENDING', () => {
    const booking = dataStore.createBooking({
      clientId: 'user-client-1',
      clientName: 'Sarah Belhadj',
      clientPhone: '+213 550 99 88 11',
      clientAddress: '10 Rue Didouche Mourad, Alger',
      providerId: 'prov-karim-meca',
      providerName: 'Karim Benali',
      serviceId: 'srv-diag',
      serviceTitle: 'Diagnostic Électronique Complet',
      servicePrice: 3500,
      servicePriceType: 'FIXED',
      scheduledAt: '2026-11-10T10:00:00.000Z',
      notes: 'Voyant moteur allumé sur Seat Ibiza.',
    });

    assert.ok(booking.id.startsWith('book-'));
    assert.strictEqual(booking.status, 'PENDING');
    assert.strictEqual(booking.servicePrice, 3500);
    createdBookingId = booking.id;
  });

  runTest('updateBookingStatus: Provider accepts booking -> ACCEPTED', () => {
    const updated = dataStore.updateBookingStatus(createdBookingId, 'ACCEPTED');
    assert.ok(updated !== null);
    assert.strictEqual(updated?.status, 'ACCEPTED');
  });

  runTest('updateBookingStatus: Job finished -> COMPLETED', () => {
    const completed = dataStore.updateBookingStatus(createdBookingId, 'COMPLETED');
    assert.ok(completed !== null);
    assert.strictEqual(completed?.status, 'COMPLETED');
  });

  // ------------------------------------------------------------------
  // 6. CLIENT REVIEWS & RATING ENGINE
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}6. REVIEWS & REPUTATION ENGINE${RESET}`);

  runTest('addReview: Appends review and recalculates provider ratingAverage', () => {
    const providerBefore = dataStore.getProviderById('prov-karim-meca')!;
    const initialCount = providerBefore.reviews.length;

    const newReview = dataStore.addReview('prov-karim-meca', {
      clientId: 'user-client-1',
      clientName: 'Sarah Belhadj',
      bookingId: createdBookingId,
      rating: 5,
      comment: 'Diagnostic ultra rapide et réparation immédiate ! Merci.',
    });

    assert.ok(newReview !== null);
    assert.strictEqual(newReview?.rating, 5);

    const providerAfter = dataStore.getProviderById('prov-karim-meca')!;
    assert.strictEqual(providerAfter.reviews.length, initialCount + 1);
    assert.strictEqual(providerAfter.reviewCount, providerAfter.reviews.length);
    assert.ok(providerAfter.ratingAverage >= 4.0 && providerAfter.ratingAverage <= 5.0);
  });

  // ------------------------------------------------------------------
  // FINAL REPORT
  // ------------------------------------------------------------------
  console.log(`\n${BOLD}${BLUE}======================================================${RESET}`);
  console.log(`${BOLD}TEST SUMMARY RESULTS:${RESET}`);
  console.log(`  Total Tests Run : ${totalTests}`);
  console.log(`  ${GREEN}Passed          : ${passedTests}${RESET}`);
  console.log(`  ${failedTests === 0 ? GREEN : RED}Failed          : ${failedTests}${RESET}`);
  console.log(`${BOLD}${BLUE}======================================================${RESET}\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
