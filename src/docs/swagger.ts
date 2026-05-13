import type { OpenAPIV3_1 } from "openapi-types";

export const swaggerDocument: OpenAPIV3_1.Document = {
  openapi: "3.1.0",
  info: {
    title: "UCAO-UUT University API",
    version: "1.0.0",
    description:
      "API universitaire officielle UCAO-UUT (etudiants, structures academiques, inscriptions) consommee par VoteBGDE.",
  },
  servers: [{ url: "http://localhost:4000/api", description: "Local development" }],
  tags: [
    { name: "Health", description: "Etat de sante" },
    { name: "Auth", description: "Authentification admins" },
    { name: "Students", description: "Gestion et verification etudiants" },
    { name: "Faculties", description: "Gestion facultes" },
    { name: "Departments", description: "Gestion departements" },
    { name: "Levels", description: "Gestion niveaux" },
    { name: "Enrollments", description: "Gestion inscriptions" },
    { name: "Admins", description: "Supervision admins" },
  ],
  paths: {
    "/health": { get: { tags: ["Health"], summary: "Health check", responses: { "200": { description: "OK" } } } },
    "/auth/login": { post: { tags: ["Auth"], summary: "Login admin", responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } } } },
    "/auth/refresh": { post: { tags: ["Auth"], summary: "Refresh tokens", responses: { "200": { description: "OK" } } } },
    "/auth/logout": { post: { tags: ["Auth"], summary: "Logout", responses: { "200": { description: "OK" } } } },
    "/students": {
      get: { tags: ["Students"], summary: "Lister etudiants (pagination/filtres)", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } },
      post: { tags: ["Students"], summary: "Creer etudiant", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } },
    },
    "/students/{id}": { get: { tags: ["Students"], summary: "Detail etudiant", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } } },
    "/students/matricule/{matricule}": { get: { tags: ["Students"], summary: "Recherche par matricule", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } } },
    "/students/email/{email}": { get: { tags: ["Students"], summary: "Recherche par email", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } } },
    "/students/{id}/status": { patch: { tags: ["Students"], summary: "Activer/desactiver etudiant", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } } },
    "/students/verify/{matricule}": {
      get: {
        tags: ["Students"],
        summary: "Verification du matricule pour VoteBGDE",
        security: [{ serviceApiKey: [] }],
        responses: { "200": { description: "OK" }, "401": { description: "API key invalide" } },
      },
    },
    "/faculties": { get: { tags: ["Faculties"], summary: "Lister facultes", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } }, post: { tags: ["Faculties"], summary: "Creer faculte", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/departments": { get: { tags: ["Departments"], summary: "Lister departements", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } }, post: { tags: ["Departments"], summary: "Creer departement", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/levels": { get: { tags: ["Levels"], summary: "Lister niveaux", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } }, post: { tags: ["Levels"], summary: "Creer niveau", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/enrollments": { get: { tags: ["Enrollments"], summary: "Lister inscriptions", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } }, post: { tags: ["Enrollments"], summary: "Creer inscription", security: [{ bearerAuth: [] }], responses: { "201": { description: "Created" } } } },
    "/admins": { get: { tags: ["Admins"], summary: "Lister admins", security: [{ bearerAuth: [] }], responses: { "200": { description: "OK" } } } },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      serviceApiKey: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
  },
};
