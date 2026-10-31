# 🛠️ ProxiService — Plateforme Hyperlocale de Services & Artisans

Plateforme moderne de mise en relation directe avec les artisans et prestataires qualifiés (*mécanicien, femme de ménage, électricien, plombier, peintre, menuisier*) basée sur un moteur de découverte spatiale et de géolocalisation par rayon kilométrique.

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- **Node.js** >= 18.x (testé et validé sur Node v25.9.0)
- **npm** >= 9.x

### 2. Lancement du serveur de développement
Dans le dossier du projet :
```bash
npm run dev
```
Ouvrez ensuite votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 🌟 Fonctionnalités Implémentées

### 1. 🔍 Moteur de Découverte Spatiale & Carte Interactive (`/search`)
- **Calcul de proximité géodésique (Formule de Haversine)** entre les coordonnées GPS du client et celles des prestataires.
- **Filtre par rayon kilométrique paramétrable (2 km à 50 km)** avec visualisation directe du cercle de couverture sur la carte.
- **Vue partagée dynamique (Split View) :**
  - Colonne gauche : cartes des artisans triables par proximité, avis, ou tarif avec badges de distance (*ex: 1.8 km de vous*).
  - Colonne droite : carte OpenStreetMap (Leaflet) avec marqueurs personnalisés, repère utilisateur, et infobulles interactives.
- **Auto-localisation GPS** en un clic via l'API HTML5 Geolocation.

### 2. 👤 Profils Professionnels & Vitrine Artisan (`/providers/[id]`)
- Badge d'artisan certifié et vérifié.
- Catalogue détaillé des prestations avec tarification claire (au forfait, à l'heure, ou sur devis).
- Galerie photos de réalisations (portfolios de chantiers / réparations).
- Notes et avis certifiés avec calcul de la moyenne en temps réel.
- Modale de réservation directe avec sélection de créneau et instructions particulières.

### 3. 📅 Espace Client & Suivi des Réservations (`/client/dashboard`)
- Suivi du statut des demandes en temps réel :
  - `PENDING` (En attente de confirmation artisan)
  - `ACCEPTED` (Confirmé par l'artisan)
  - `COMPLETED` (Prestation réalisée)
- Système de notation & d'avis : évaluation 1 à 5 étoiles et commentaire après service.

### 4. 🧰 Espace Professionnel / Cockpit Artisan (`/provider/dashboard`)
- Tableau de bord avec indicateurs clés : demandes à traiter, missions confirmées, note moyenne, et chiffre d'affaires estimé.
- Traitement en 1 clic des demandes entrantes :
  - **Bouton Accepter** (`ACCEPTED`)
  - **Bouton Refuser** (`REJECTED`)
  - **Bouton Terminé** (`COMPLETED`)
- Sélecteur de profil en mode démo pour tester la plateforme sous l'angle de différents métiers (*Karim le mécanicien, Fatima la femme de ménage, Ahmed l'électricien, etc.*).

---

## 🏛️ Architecture Technique & Spécifications

La conception complète, le cadrage MoSCoW, les diagrammes de cas d'utilisation, de base de données (ERD PostGIS), de séquences et de machine d'état sont consignés dans le document d'architecture :
📄 [system_architecture_design.md](C:/Users/DELL/.gemini/antigravity/brain/64500034-046b-49d5-ae13-c5de2663235c/system_architecture_design.md)

### Endpoints API REST

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Liste des métiers et catégories de services |
| `GET` | `/api/providers/search` | Recherche spatiale (`lat`, `lng`, `radius`, `category`, `minRating`, `query`) |
| `GET` | `/api/providers/:id` | Détails complets du profil, services et avis |
| `GET` | `/api/bookings` | Liste des réservations |
| `POST` | `/api/bookings` | Création d'une demande de réservation |
| `PATCH` | `/api/bookings/:id` | Mise à jour du statut (`ACCEPTED`, `REJECTED`, `COMPLETED`) |
| `POST` | `/api/reviews` | Publication d'un avis client et recalcul de la note |
