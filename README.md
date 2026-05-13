# UCAO-UUT University API

API universitaire officielle separee de VoteBGDE.

## Objectif

Cette API gere les donnees academiques de reference:
- etudiants
- facultes
- departements
- niveaux
- inscriptions
- verification publique du matricule

VoteBGDE consommera cette API via HTTP REST.

## Stack

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT access/refresh
- Swagger
- Zod validation
- Clean Architecture

## Architecture

- `src/modules/students`
- `src/modules/faculties`
- `src/modules/departments`
- `src/modules/levels`
- `src/modules/enrollments`
- `src/modules/auth`
- `src/modules/admins`

Chaque module suit: controller, service, repository, dto, validator, interfaces, routes.

## Endpoint public pour VoteBGDE

- `GET /api/students/verify/:matricule`

Retourne l'existence du matricule et les infos academiques essentielles.
Ce endpoint est protege par:
- `x-api-key` obligatoire
- rate limiting dedie

### Contrat inter-service

- Header requis: `x-api-key: <SERVICE_API_KEY>`
- Reponse 200: matricule connu (avec `exists: true`) ou inconnu (`exists: false`)
- Reponse 401: cle API absente/invalide

Ordre de demarrage local recommande:

1. demarrer `ucao-university-api` (port 4000)
2. demarrer `VoteGBDE` (port 3000)

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Documentation

- Swagger UI: `http://localhost:4000/api/docs`
- Swagger JSON: `http://localhost:4000/api/docs.json`
