# 🛠️ ProxiService — Plateforme Hyperlocale de Services & Artisans

Plateforme complète de mise en relation directe avec les artisans et professionnels qualifiés (*mécaniciens auto/moto, femmes de ménage, électriciens, plombiers, peintres en bâtiment, menuisiers*) basée sur un moteur de découverte spatiale, calcul géodésique de Haversine, contrôle d'accès strict (RBAC), et conteneurisation Docker Microsoft SQL Server.

---

## 📑 Documentation Officielle & Spécifications

- 📄 **Rapport PDF Officiel (SRS / SAD) :** [`docs/ProxiService_Requirements_and_Architecture_Report.pdf`](docs/ProxiService_Requirements_and_Architecture_Report.pdf)
- 📐 **Spécification Complète des Exigences & Tous les Diagrammes de Flux UML :** [`docs/SOFTWARE_REQUIREMENTS_AND_ARCHITECTURE_SPECIFICATION.md`](docs/SOFTWARE_REQUIREMENTS_AND_ARCHITECTURE_SPECIFICATION.md)
- 🏛️ **Document d'Architecture Système :** [`system_architecture_design.md`](C:/Users/DELL/.gemini/antigravity/brain/64500034-046b-49d5-ae13-c5de2663235c/system_architecture_design.md)

---

## 🚀 Démarrage Rapide

### Option A : Lancement Local (Développement)
```bash
npm install
npm test       # Exécute l'ensemble des 31 tests automatisés
npm run dev    # Démarre le serveur Next.js sur http://localhost:3000
```

### Option B : Lancement Conteneurisé avec Docker Compose (SQL Server + Web)
```bash
docker compose up -d --build
```
Cette commande démarre :
- **`proxiservice-sqlserver`** : Microsoft SQL Server 2022 (port 1433) avec initialisation automatique via `init-db.sql`.
- **`proxiservice-web`** : Application web Next.js 14 en mode production (port 3000).

---

## 🌟 Fonctionnalités Implémentées & Validées

### 1. 🔐 Contrôle d'Accès par Rôles (RBAC) & Espaces Ségrégués
- **Espace Prestataire / Artisan (`/provider/dashboard`) :**
  - Tableau de bord professionnel (demandes à traiter, missions confirmées, chiffre d'affaires estimé, note moyenne).
  - Gestionnaire de tarifs en direct : ajout/modification de prestations, tarifs (forfait, par heure, sur devis), et durée.
  - Ajustement du rayon d'action kilométrique ($5 \text{ km}$ à $60 \text{ km}$).
  - Aucune pollution visuelle client (les liens de recherche client sont masqués).
- **Espace Client Particulier (`/client/dashboard`) :**
  - Suivi des demandes en temps réel (`PENDING`, `ACCEPTED`, `COMPLETED`).
  - Système de notation & avis certifiés (1 à 5 étoiles) après prestation.
- **Gardes de Sécurité (`RoleGuard`) :** Redirection immédiate et protection contre les accès non autorisés.

### 2. 🔍 Moteur de Découverte Spatiale & Carte Interactive (`/search`)
- Calcul trigonométrique géodésique de **Haversine** entre le client et les artisans.
- Filtre dynamique par rayon kilométrique paramétrable avec cercle de couverture sur OpenStreetMap (Leaflet).
- Auto-localisation GPS via l'API HTML5 Geolocation.

### 3. 🧪 Suite de Tests Automatisée (31/31 Validés)
- `tests/comprehensive-api.test.ts` (20 tests : Géolocalisation, Auth, Inscription, Filtres, Réservations, Avis).
- `tests/rbac-security.test.ts` (11 tests : Ségrégation de la navigation, Route Guards, Isolation des tarifs).

---

## 📊 Matrice des Rôles & Endpoints API

| Méthode | Route | Rôle(s) Autorisé(s) | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public / Guest | Inscription Client ou Vitrine Artisan complète |
| `POST` | `/api/auth/login` | Public / Guest | Authentification et émission de token de session |
| `GET` | `/api/auth/me` | Authentifié | Profil de la session active |
| `GET` | `/api/categories` | Public | Liste des 6 métiers & spécialités |
| `GET` | `/api/providers/search` | Public | Recherche spatiale par rayon, coordonnées, métier |
| `GET` | `/api/providers/:id` | Public | Profil complet d'un artisan & vitrine |
| `PUT` | `/api/providers/:id` | `PROVIDER` | Mise à jour des tarifs, prestations et rayon |
| `GET` | `/api/bookings` | Authentifié | Liste des réservations |
| `POST` | `/api/bookings` | `CLIENT` | Création d'une demande de réservation |
| `PATCH`| `/api/bookings/:id` | `PROVIDER` / `CLIENT` | Acceptation, refus ou achèvement de la mission |
| `POST` | `/api/reviews` | `CLIENT` | Dépôt d'un avis noté et recalcul de la note moyenne |
