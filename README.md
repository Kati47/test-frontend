# Gestion de Fiches Assurance

Application front-end de gestion de fiches assurance, réalisée avec Next.js App Router, React et TypeScript.

Objectif du projet: proposer une expérience simple pour consulter, filtrer, paginer et mettre à jour des fiches via une API locale simulée.

## 1) Stack technique

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- React Query (`@tanstack/react-query`) pour l’état serveur
- React Hook Form + Zod pour les formulaires et la validation
- API locale simulée avec routes Next.js (`src/app/api/*`)

## 2) Prérequis

- Node.js 18+
- npm 9+

Vérification rapide:

```bash
node -v
npm -v
```

## 3) Installation

Depuis la racine du projet:

```bash
npm install
```

## 4) Lancement

### Mode développement

```bash
npm run dev
```

Puis ouvrir:

`http://localhost:3000`

### Build production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## 5) Fonctionnalités couvertes

### Page Liste Fiches

- Affichage paginé (10 éléments par page)
- Colonnes:
	- Nom client
	- Produit (`AUTO`, `MRH`, `RCPRO`)
	- Statut (`NEW`, `ASSIGNED`, `IN_PROGRESS`, `CLOSED`)
	- Conseiller
	- Date de création
	- Action “Voir”
- Filtres:
	- Par produit
	- Par statut
	- Recherche par nom
- UX:
	- Badge couleur selon statut
	- État de chargement
	- Message liste vide

### Page Détail Fiche

- Section Client: nom, téléphone, email
- Section Produit: type, garanties, prime
- Section Actions:
	- Changer statut
	- Assigner un conseiller

### Simulation des rôles

- `ADMIN`: accès à toutes les fiches
- `ADVISOR`: accès uniquement aux fiches du conseiller sélectionné

## 6) API simulée

L’application n’utilise pas de backend externe. Les données transitent par une API locale Next.js:

- `GET /api/fiches` → liste paginée + filtres
- `GET /api/fiches/[id]` → détail d’une fiche
- `PATCH /api/fiches/[id]` → mise à jour statut / assignation

Source de données mock:

- `src/lib/mock-fiches.ts`

Store mémoire:

- `src/lib/fiches-store.ts`

## 7) Architecture du projet

```text
src/
	app/
		api/fiches/                # API locale (liste, détail, mutation)
		fiches/[id]/page.tsx       # page détail
		page.tsx                   # page liste
	components/
		layout/                    # AppBar, Footer
		providers/                 # QueryProvider
		ui/                        # composants UI réutilisables
	features/fiches/
		api.ts                     # appels front vers API locale
		constants.ts               # constantes métier (produits, statuts, conseillers)
		list-page.tsx              # écran liste
		detail-page.tsx            # écran détail
	lib/
		fiches-store.ts            # logique de filtre/pagination/mock mutations
		mock-fiches.ts             # dataset mock
		query-client.ts            # config React Query
	types/
		fiche.ts                   # types métier TypeScript
```

## 8) Choix techniques (et pourquoi)

- **Next.js App Router**
	- Routing pages + API locale dans un même projet
	- Structure claire pour un mini-projet full front

- **React Query**
	- Cache serveur propre
	- Invalidation ciblée après mutation (statut/assignation)
	- Simplifie loading/empty/error states

- **React Hook Form + Zod**
	- Formulaires plus robustes et lisibles
	- Validation déclarative et centralisée

- **API simulée locale**
	- Permet de tester des flux proches du réel sans backend externe
	- Facile à migrer vers une API réelle ensuite

- **Architecture modulaire (`features`, `lib`, `components`, `types`)**
	- Sépare UI, logique métier, accès data et types
	- Facilite maintenance et extension

## 9) Limites actuelles

- Authentification/autorisation non sécurisée (simulation)
- Données mock statiques

## 10) Pistes d’évolution

- Brancher une base de données réelle + API sécurisée
- Ajouter authentification (JWT/session)
- Appliquer contrôle d’accès strict côté serveur
- Ajouter tests unitaires/intégration
