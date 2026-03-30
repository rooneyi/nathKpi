# KPIbank — Documentation Technique & Fonctionnelle

> **Version** : 1.0.0 — Mars 2026  
> **Stack** : Laravel 11 + Inertia.js + React 19 + TailwindCSS v4 + Radix UI (Shadcn-like)

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Analyse du système existant](#2-analyse-du-système-existant)
3. [Modélisation UML du nouveau système (KPIbank)](#3-modélisation-uml-du-nouveau-système-kpibank)
   - [3.1 Acteurs](#31-acteurs)
   - [3.2 Diagramme de cas d'utilisation](#32-diagramme-de-cas-dutilisation)
   - [3.3 Diagrammes d'activités par rôle](#33-diagrammes-dactivités-par-rôle)
4. [Architecture technique](#4-architecture-technique)
5. [Interface utilisateur — ce qui a été implémenté](#5-interface-utilisateur--ce-qui-a-été-implémenté)
   - [5.1 Page d'accueil (Welcome)](#51-page-daccueil-welcome)
   - [5.2 Sidebar de navigation](#52-sidebar-de-navigation)
   - [5.3 Tableau de bord (Dashboard)](#53-tableau-de-bord-dashboard)
6. [Design system & composants Shadcn-like](#6-design-system--composants-shadcn-like)
7. [Choix technologiques justifiés](#7-choix-technologiques-justifiés)
8. [Guide de démarrage rapide](#8-guide-de-démarrage-rapide)

---

## 1. Présentation du projet

**KPIbank** est une application web de suivi des indicateurs de performance bancaire (KPI). Elle répond à un besoin concret observé dans le système existant : la communication manuelle et non structurée entre les succursales et le siège central pour la remontée des informations financières.

### Objectif général

Numériser, centraliser et automatiser le processus de collecte, validation et analyse des données financières entre les succursales et le siège central d'une banque.

### Contexte

Le système existant repose entièrement sur des échanges physiques ou par e-mail de rapports financiers. Ce processus est :
- **lent** : délais importants entre la saisie et l'analyse
- **peu fiable** : risques d'erreurs, de perte de documents
- **non traçable** : absence d'historique structuré
- **non consolidé** : pas de comparaison en temps réel entre succursales

---

## 2. Analyse du système existant

D'après les diagrammes de cas d'utilisation du système existant (source : `docs/`), deux acteurs principaux interagissaient :

### Acteur 1 : Succursale

| Cas d'utilisation | Description |
|---|---|
| Collecter les informations financières | Récupération manuelle des données comptables |
| Consulter registres et dossiers | Accès aux documents internes |
| Saisir données financières | Enregistrement sur papier ou tableur |
| Élaborer rapports financiers | Consolidation manuelle |
| Envoyer rapports (mail/courrier) | Transmission non sécurisée |
| Transférer rapports physiquement | Déplacement physique des documents |
| Archiver rapports/dossiers internes | Stockage physique |

### Acteur 2 : Siège Central

| Cas d'utilisation | Description |
|---|---|
| Recevoir rapports par mail/courrier | Réception passive |
| Recevoir rapports physiques | Récupération physique |
| Télécharger rapports | Non standardisé |
| Vérifier conformité et cohérence | Contrôle manuel |
| Examiner indicateurs financiers | Analyse manuelle |
| Analyser performances financières | Étude sans outils spécifiques |
| Identifier écarts dans les performances | Détection tardive |
| Élaborer rapports | Retraitement des données |
| Présenter résultats en réunion | Communication finale |

**Problème fondamental** : le flux est entièrement manuel, séquentiel, et ne permet aucune réactivité ni analyse en temps réel.

---

## 3. Modélisation UML du nouveau système (KPIbank)

### 3.1 Acteurs

Le nouveau système introduit **3 acteurs** avec des rôles distincts :

```
┌─────────────────────────────────────────────────────────────┐
│                        KPIbank                              │
│                                                             │
│  👤 Succursale        👤 Siège Central     👤 Administrateur │
│  (Utilisateur)        (Kinshasa)           (Système)        │
└─────────────────────────────────────────────────────────────┘
```

| Acteur | Rôle | Accès |
|---|---|---|
| **Succursale** | Saisie et soumission des données financières | Interface de saisie, génération de rapports |
| **Siège Central** | Analyse, comparaison, supervision des KPIs | Tableau de bord analytique complet |
| **Administrateur** | Supervision du système, gestion des accès | Interface d'administration |

### 3.2 Diagramme de cas d'utilisation

Tous les acteurs ont comme précondition commune : **Se connecter** (`<<include>>`).

```
┌─────────────────────────── KPIbank ──────────────────────────────────────────┐
│                                                                               │
│  👤 Succursale                          👤 Siège Central                     │
│  ──────────────────                     ─────────────────                     │
│  • Créer compte          <<include>>    • Consulter indicateurs               │
│  • Saisir données fin.   ──────────►   • Analyser performances               │
│  • Enregistrer indicateurs              • Comparer succursales                │
│  • Modifier données                     • Visualiser tableau de bord         │
│  • Générer rapports                     • Générer rapports                    │
│  • Construire historique                                                      │
│  • Consulter performances                                                     │
│                                                                               │
│                              ┌─────────────┐                                 │
│                              │ Se connecter│ ◄── <<include>> de tous         │
│                              └─────────────┘                                 │
│                                                                               │
│  👤 Administrateur                                                            │
│  ──────────────────                                                           │
│  • Supervision système  <<include>>                                           │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Diagrammes d'activités par rôle

#### Succursale (Utilisateur de la filiale)

```
[Début]
    │
    ▼
[Créer compte]
    │
    ▼
[Se connecter]
    │
    ▼
[Gérer données (Saisir / Enregistrer / Modifier)]
    │
    ▼
[Créer rapport financier]
    │
    ▼
[Consulter données (Historique, Performances)]
    │
    ▼
[Fin]
```

#### Administrateur Système

```
[Début]
    │
    ▼
[Se connecter]
    │
    ▼
[Accéder à l'interface d'administration]
    │
    ▼
[Superviser état et performances systèmes]
    │
    ▼
[Fin]
```

#### Siège Central (Kinshasa)

```
[Début]
    │
    ▼
[Se connecter]
    │
    ▼
[Accéder à l'interface d'analyse]
    │
    ▼
[Analyser données (Analyser, Comparer, Visualiser)]
    │
    ▼
[Générer rapport de synthèse]
    │
    ▼
[Fin]
```

---

## 4. Architecture technique

```
nathKpi/
├── app/
│   ├── Http/               # Contrôleurs Laravel
│   ├── Models/             # Modèles Eloquent
│   ├── Actions/            # Actions métier (Fortify)
│   └── Providers/          # Service providers
├── resources/
│   ├── css/
│   │   └── app.css         # TailwindCSS v4 + design tokens
│   └── js/
│       ├── components/     # Composants React réutilisables
│       │   ├── ui/         # Composants Shadcn-like (Card, Badge, Button…)
│       │   ├── app-sidebar.tsx   # ← MODIFIÉ : Navigation KPIbank
│       │   └── app-logo.tsx      # ← MODIFIÉ : Logo KPIbank
│       ├── layouts/        # Layouts Inertia
│       ├── pages/
│       │   ├── dashboard.tsx     # ← MODIFIÉ : Dashboard KPI complet
│       │   └── welcome.tsx       # ← MODIFIÉ : Landing page KPIbank
│       └── types/          # Types TypeScript
├── routes/
│   └── web.php             # Routes Laravel
├── database/
│   └── migrations/         # Migrations SQLite
└── docs/                   # Documentation & diagrammes
```

### Flux de données (Inertia.js)

```
Browser (React)  ←──────── Inertia Response ──────────  Laravel Controller
      │                                                          │
      │  Inertia Request (XHR)                                  │
      └──────────────────────────────────────────────────────►  │
                                                                 │
                                                          Eloquent / SQLite
```

---

## 5. Interface utilisateur — ce qui a été implémenté

### 5.1 Page d'accueil (Welcome)

**Fichier** : `resources/js/pages/welcome.tsx`

La page d'accueil a été entièrement rebranding pour reflèter KPIbank :

| Section | Contenu |
|---|---|
| **Header sticky** | Logo KPIbank + navigation (Se connecter / Créer un compte) |
| **Hero** | Titre gradient, description du projet, CTA primaire + secondaire |
| **Stats** | 4 métriques clés (succursales, taux conformité, rôles, disponibilité) |
| **Features** | 6 fonctionnalités présentées en grille avec icônes colorées |
| **CTA final** | Appel à l'action pour inscription ou accès au dashboard |
| **Footer** | Mention légale + logo |

**Design** :
- Background à dégradé radial subtil
- Cards avec effets hover (`-translate-y-0.5`, `shadow-md`)
- Header `backdrop-blur-xl` pour effet glassmorphism
- Gradient textuel sur le titre principal

### 5.2 Sidebar de navigation

**Fichier** : `resources/js/components/app-sidebar.tsx`

La sidebar est organisée en **3 sections de navigation par rôle** :

```
┌─────────────────────────────┐
│  🏦 KPIbank                 │
│     Indicateurs bancaires   │
├─────────────────────────────┤
│  SUCCURSALE                 │
│  ├ Tableau de bord          │
│  ├ Saisie des données       │
│  ├ Rapports financiers      │
│  └ Historique               │
├─────────────────────────────┤
│  SIÈGE CENTRAL             │
│  ├ Analyse KPIs             │
│  ├ Succursales              │
│  ├ Comparatif               │
│  └ Générer rapport          │
├─────────────────────────────┤
│  ADMINISTRATION             │
│  └ Supervision système      │
├─────────────────────────────┤
│  Notifications              │
│  Documentation              │
│  Paramètres                 │
├─────────────────────────────┤
│  [Avatar] Nom utilisateur   │
└─────────────────────────────┘
```

### 5.3 Tableau de bord (Dashboard)

**Fichier** : `resources/js/pages/dashboard.tsx`

Le dashboard est divisé en plusieurs zones :

#### Zone 1 : En-tête contextualisé
- Salutation personnalisée avec prénom de l'utilisateur
- Date du jour en français
- Badges de statut système (opérationnel / rapports en attente)

#### Zone 2 : Cards KPI (grille 4 colonnes)

| KPI | Valeur | Indicateur |
|---|---|---|
| Résultat Net | 4 825 000 USD | +12.4% ↑ |
| Dépôts Clients | 38 200 000 USD | +7.1% ↑ |
| Crédits Accordés | 21 950 000 USD | -3.2% ↓ |
| Taux de Recouvrement | 91.4% | +2.1% ↑ |

Chaque card dispose :
- D'une couleur thématique personnalisée (`emerald`, `blue`, `amber`, `violet`)
- D'un fond coloré semi-transparent
- D'un icône Lucide React
- D'une variation vs mois précédent avec flèche directionnelle

#### Zone 3 : Graphique mensuel + Performances succursales

**Côté gauche** : Mini bar-chart SVG (6 mois, Dépôts vs Crédits) avec sommaire des 3 derniers mois.

**Côté droit** : Liste des 5 succursales avec :
- Anneau de score SVG animé (couleur selon seuil : vert ≥85%, orange ≥70%, rouge <70%)
- Badge de statut (Conforme / En attente / Non conforme)
- Nombre de rapports soumis
- Indicateur de tendance (↑ TrendingUp / ↓ TrendingDown)

#### Zone 4 : Table des rapports récents

Tableau avec les 5 derniers rapports soumis :
- Succursale, Type de rapport, Date, Statut (coloré)

---

## 6. Design system & composants Shadcn-like

Le projet utilise des composants **Shadcn-like** basés sur **Radix UI** avec **TailwindCSS v4**.

### Tokens de design (CSS custom properties)

```css
/* Light mode */
--primary: oklch(0.205 0 0)       /* Quasi-noir */
--background: oklch(1 0 0)         /* Blanc pur */
--muted: oklch(0.97 0 0)           /* Gris très clair */
--border: oklch(0.922 0 0)         /* Bordure subtile */

/* Dark mode */
--primary: oklch(0.985 0 0)        /* Blanc */
--background: oklch(0.145 0 0)     /* Quasi-noir */
```

### Composants utilisés dans le dashboard

| Composant | Usage |
|---|---|
| `<Card>` / `<CardHeader>` / `<CardContent>` | Conteneurs KPI et sections |
| `<Badge>` | Statuts (Conforme, En attente, Rejeté) |
| `<Sidebar>` / `<SidebarGroup>` | Navigation principale |
| `<SidebarGroupLabel>` | Étiquettes de section |

### Palette de couleurs fonctionnelles

| Couleur | Usage |
|---|---|
| `emerald` | Positif, conforme, succès |
| `red` | Négatif, non conforme, erreur |
| `amber` | En attente, neutre, avertissement |
| `blue` | Dépôts, informations |
| `violet` | Crédits, analytique |

---

## 7. Choix technologiques justifiés

### Laravel 11 + Inertia.js
- **Pourquoi** : Permet de combiner la robustesse du backend Laravel (auth, validation, ORM) avec une SPA React sans avoir besoin d'une API séparée
- **Avantage** : Intégration naturelle de Fortify pour l'authentification multi-rôles

### React 19 + TypeScript
- **Pourquoi** : Typage fort pour éviter les erreurs de données KPI critiques, composants réutilisables
- **React Compiler** : Optimisation automatique sans useMemo manuel

### TailwindCSS v4
- **Pourquoi** : V4 utilise les CSS custom properties nativement avec `@theme`, permettant un design system cohérent
- **Avantage** : Tokens partagés entre light/dark mode via oklch

### Radix UI (Shadcn-like)
- **Pourquoi** : Composants accessibles (ARIA) sans styles imposés, personnalisables entièrement
- **Composants** : Sidebar, Dialog, DropdownMenu, Badge, Card, etc.

### SQLite (dev) → PostgreSQL/MySQL (prod)
- **Pourquoi** : Démarrage rapide sans configuration serveur DB pour le développement
- **Migration** : Laravel Eloquent permet de changer de SGBD sans modification du code

---

## 8. Guide de démarrage rapide

### Prérequis

- PHP 8.2+
- Node.js 20+
- Composer

### Installation

```bash
# 1. Installer les dépendances PHP
composer install

# 2. Installer les dépendances JavaScript
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Créer et migrer la base de données
php artisan migrate

# 6. (Optionnel) Générer les routes JS
php artisan wayfinder:generate
```

### Lancer l'application

```bash
# Terminal 1 : Backend Laravel
php artisan serve

# Terminal 2 : Frontend Vite
npm run dev
```

L'application sera accessible sur `http://localhost:8000`.

### Comptes par défaut

| Rôle | Email | Mot de passe |
|---|---|---|
| Succursale | succursale@kpibank.cd | password |
| Siège Central | siege@kpibank.cd | password |
| Administrateur | admin@kpibank.cd | password |

> **Note** : Ces comptes sont à créer via la page d'inscription ou les seeders.

---

## Annexe : Correspondance Modélisation → Implémentation

| Élément UML | Implémentation actuelle |
|---|---|
| Acteur Succursale | Utilisateur authentifié — interface saisie + rapports |
| Acteur Siège Central | Vue analytique — dashboard KPI + comparatif |
| Acteur Administrateur | Section supervision système dans la sidebar |
| UC "Se connecter" | Laravel Fortify + Inertia Auth |
| UC "Créer compte" | Page `/register` avec Fortify |
| UC "Saisir données" | Sidebar → "Saisie des données" (à développer) |
| UC "Générer rapport" | Sidebar → "Rapports financiers" (à développer) |
| UC "Analyser performances" | Dashboard → Zone performances succursales |
| UC "Visualiser tableau de bord" | `pages/dashboard.tsx` — KPI cards + graphiques |
| UC "Comparer succursales" | Sidebar → "Comparatif" (à développer) |
| UC "Supervision système" | Sidebar → "Supervision système" (à développer) |

---

*Documentation générée le 30 Mars 2026 — KPIbank v1.0*
