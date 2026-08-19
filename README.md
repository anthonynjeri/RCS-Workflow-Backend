# RCS Workflow Backend — Hackathon Équipe 5

Backend NestJS pour créer, stocker et exécuter des workflows de conversation RCS (Rich Communication Services) interactifs. Développé pour le **Hackathon smsmode France**.

---

## Ce que ça fait

Permet de créer un workflow de conversation en arbre (question → réponses → question suivante) et de le délivrer sur le téléphone d'un utilisateur via RCS. L'utilisateur navigue dans le workflow en appuyant sur des boutons de réponse. Le backend suit la position de chaque utilisateur dans la conversation et le redirige vers le bon nœud suivant.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | NestJS + Express |
| Base de données | SQLite via `better-sqlite3` + TypeORM |
| Messagerie RCS | `@smsmode/rcs` |
| Tunnel (dev) | ngrok — `https://smsmode-hack-team-5.ngrok.dev` |
| Documentation API | Swagger — `/api` |

---

## Architecture

```
src/
├── work-flow/       # CRUD des workflows, routage des conversations
├── messaging/       # Envoi de messages RCS (texte, carte, carousel)
├── webhooks/        # Événements RCS entrants (réponses utilisateur, statuts)
└── _utils/          # Configuration et validation des variables d'environnement
```

---

## Endpoints API

### Workflows

| Méthode | Chemin | Description |
|---|---|---|
| `GET` | `/rcs-workflow-backend-api/work-flow` | Lister tous les workflows sauvegardés |
| `GET` | `/rcs-workflow-backend-api/work-flow/:id` | Récupérer un workflow par son ID |
| `POST` | `/rcs-workflow-backend-api/work-flow` | Créer et sauvegarder un workflow nommé |
| `POST` | `/rcs-workflow-backend-api/work-flow/start-conversation` | Démarrer ou continuer une conversation pour un numéro de téléphone |
| `POST` | `/rcs-workflow-backend-api/work-flow/test-send` | Créer un workflow et l'envoyer immédiatement à un téléphone |

### Messagerie

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/rcs-workflow-backend-api/callbacks/sendMessage` | Envoyer un message RCS texte simple |
| `POST` | `/rcs-workflow-backend-api/callbacks/cardMessage` | Envoyer un message RCS de type carte |

### Webhooks (entrants depuis smsmode)

| Méthode | Chemin | Description |
|---|---|---|
| `POST` | `/rcs-workflow-backend-api/webhooks/rcs/mo` | Recevoir les réponses utilisateur et avancer leur position dans le workflow |
| `POST` | `/rcs-workflow-backend-api/webhooks/rcs/status` | Recevoir les mises à jour de statut de livraison/lecture |

---

## Format du payload workflow

```json
{
  "name": "Onboarding client",
  "entryNodeId": "node_root_primary",
  "nodes": {
    "node_root_primary": {
      "type": "TEXT",
      "text": "Bienvenue ! Que souhaitez-vous faire ?",
      "suggestions": [
        { "type": "REPLY", "text": "En savoir plus", "postbackData": "EN_SAVOIR_PLUS", "nextNode": "info_node" },
        { "type": "REPLY", "text": "Support", "postbackData": "SUPPORT", "nextNode": "support_node" }
      ]
    },
    "info_node": {
      "type": "TEXT",
      "text": "Voici toutes les informations...",
      "suggestions": []
    },
    "support_node": {
      "type": "TEXT",
      "text": "Un agent vous contactera sous 24h.",
      "suggestions": []
    }
  }
}
```

Le champ optionnel `reactFlowData` stocke le graphe brut du canvas frontend pour une restauration complète dans l'éditeur visuel.

---

## Routage des conversations

1. Un workflow est envoyé à un utilisateur via `test-send` — sa session est créée en base de données
2. Quand il appuie sur un bouton de réponse, le webhook se déclenche avec son `postbackData`
3. Le backend le fait correspondre à une suggestion, suit `nextNode` et envoie le message suivant
4. Si un utilisateur reçoit un **nouveau workflow**, sa session est automatiquement réinitialisée au nœud d'entrée du nouveau workflow

---

## Schéma de la base de données

```sql
-- Définitions des workflows
CREATE TABLE "work-flow" (
  "id"            varchar PRIMARY KEY,
  "name"          varchar NOT NULL,
  "entryNodeId"   varchar NOT NULL DEFAULT 'START',
  "nodes"         json NOT NULL,
  "reactFlowData" json,             -- graphe canvas pour restauration frontend
  "createdAt"     datetime NOT NULL DEFAULT (datetime('now'))
);

-- Sessions utilisateurs actives
CREATE TABLE "workflow_conversation" (
  "phoneNumber"      varchar PRIMARY KEY,
  "currentNodeId"    varchar NOT NULL DEFAULT 'START',
  "workflowId"       varchar NOT NULL,
  "lastInteraction"  datetime NOT NULL DEFAULT (datetime('now'))
);
```

---

## Lancer en local

```bash
npm install
npm run start:dev
```

Nécessite un fichier `.env` avec vos identifiants API smsmode. Le serveur démarre sur le port `PORT` (3000 par défaut).
