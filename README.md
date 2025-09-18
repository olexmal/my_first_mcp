# My First MCP — Recipe Context Server

A minimal TypeScript project that exposes recipe data as an MCP (Model Context Protocol) server so an LLM can retrieve contextual documents (recipes) for retrieval-augmented generation or tool use.

## Features
- Simple in-memory recipe data (src/data/recipes.ts)
- TypeScript service layer (src/services)
- Minimal MCP-compatible HTTP endpoints that return contexts for use by an LLM
- Dev workflow using pnpm

## Getting started

### Prerequisites
- Node.js (LTS)
- pnpm

### Install

pnpm install

### Run in development (auto-reload)

pnpm run dev:server

### Build and run (production)

pnpm run build
pnpm start

By default the server listens on port 3333. Override with the PORT environment variable, e.g.:

# Windows PowerShell
$env:PORT=4000; pnpm run build; $env:PORT=4000; node dist/server.js

# Unix
PORT=4000 pnpm run build && PORT=4000 node dist/server.js

## Server endpoints

- GET /health
  - Returns: { "status": "ok" }

- GET /recipes
  - Returns recipe summaries (id, title, tags)

- GET /recipes/:id
  - Returns the full recipe object

- GET /search?tag=<tag>
  - Returns full recipe objects filtered by tag

## MCP-compatible endpoints

- GET /mcp/contexts
  - Query: optional ?tag=<tag>
  - Response: { "contexts": [ { id, title, tags, content }, ... ] }
  - Each context.content is a plain-text document with title, servings, prep time, ingredients and steps — suitable for retrieval by an LLM.

- GET /mcp/contexts/:id
  - Response: { "context": { id, title, tags, content } }

## Quick examples

curl http://localhost:3333/health
curl http://localhost:3333/mcp/contexts
curl http://localhost:3333/mcp/contexts?tag=dessert
curl http://localhost:3333/mcp/contexts/chocolate-cake

## How to extend

- Add more recipes: edit src/data/recipes.ts (Recipe shape in src/types.ts).
- Persist recipes: replace the in-memory data with a JSON file or database and update services/recipeService.ts.
- Add authentication: add middleware to server.ts and protect the MCP endpoints.
- Return embeddings: compute embeddings (or store precomputed ones) and include vector metadata alongside contexts for vector search.

## Notes

- The project uses TypeScript and ships both source (src/) and compiled output (dist/). Keep dist/ out of version control.
- Keep pnpm-lock.yaml committed so everyone installs the same dependency tree.

## License

MIT

## Example: use with LM Studio

This project exposes simple HTTP MCP endpoints that LM Studio (or any LLM workspace that supports HTTP tools) can call to retrieve contextual documents. The steps below show a minimal, editor-agnostic setup you can reproduce in LM Studio.

1. Start the server locally

   pnpm run dev:server

   The server will be available at http://localhost:3333 by default.

2. Create an HTTP tool in LM Studio

   - Method: GET
   - URL: http://localhost:3333/mcp/contexts?tag={{tag}}
   - Description: Retrieves recipe contexts filtered by a tag. Replace {{tag}} with the tag you want (e.g. "dessert").
   - Response parsing: JSON → use the `contexts` array; each item has `id`, `title`, `tags`, `content`.

   Example response (truncated):
   {
     "contexts": [
       {
         "id": "chocolate-cake",
         "title": "Simple Chocolate Cake",
         "tags": ["dessert","cake","chocolate"],
         "content": "Title: Simple Chocolate Cake\nServings: 8\nPrep time: 60 minutes\n\nIngredients:\n- ...\n\nSteps:\n1. ..."
       }
     ]
   }

3. Use the tool inside a prompt or instruction flow

   - Option A: Retrieval-augmented prompt
     1. Call the tool with the desired tag (for example `tag=dessert`).
     2. Concatenate the top N returned `content` strings and include them before the question you send to the LLM.

     Prompt template example:

     Contexts:
     {{#each contexts}}{{content}}\n---\n{{/each}}

     Question: How do I make a chocolate cake using the steps above? Provide a concise shopping list and a short timeline.

   - Option B: Tool-assisted agent (LM Studio tool call)
     1. Configure your agent to call the HTTP tool when it needs factual recipe information.
     2. The agent can then read the `content` field from the tool's JSON response and use it to produce answers grounded on the recipe text.

Notes and tips
- If LM Studio supports a response selector or JSONPath, point it at `$.contexts[*].content` (or at the whole contexts array if you prefer richer metadata).
- You can return precomputed embeddings or vector IDs from the MCP endpoints if your LM Studio workflow supports vector search. Add a field like `embeddingId` or `embedding` to the context objects and adapt the tool response parsing.
- For remote LLMs or containerized LM Studio, replace localhost with the machine IP or expose the port appropriately.
