import express from "express";
import cors from "cors";
import { listRecipes as listSummaries, getRecipeById, searchByTag } from "./services/recipeService";
import { recipes } from "./data/recipes";
import { Recipe } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

function recipeToContext(r: Recipe) {
  const ingredients = r.ingredients.map((i) => `- ${i}`).join("\n");
  const steps = r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return {
    id: r.id,
    title: r.title,
    tags: r.tags ?? [],
    content: `Title: ${r.title}\nServings: ${r.servings ?? "n/a"}\nPrep time: ${r.prepTimeMinutes ?? "n/a"} minutes\n\nIngredients:\n${ingredients}\n\nSteps:\n${steps}`,
  };
}

// App routes
app.get("/recipes", (req, res) => {
  const summaries = listSummaries();
  res.json(summaries);
});

app.get("/recipes/:id", (req, res) => {
  const r = getRecipeById(req.params.id);
  if (!r) return res.status(404).json({ error: "not found" });
  res.json(r);
});

app.get("/search", (req, res) => {
  const tag = (req.query.tag as string) || "";
  if (!tag) return res.status(400).json({ error: "tag query required" });
  const results = searchByTag(tag);
  res.json(results);
});

// Minimal MCP-compatible endpoints
app.get("/mcp/contexts", (req, res) => {
  const tag = (req.query.tag as string) || undefined;
  let items = recipes;
  if (tag) items = searchByTag(tag);
  const contexts = items.map(recipeToContext);
  res.json({ contexts });
});

app.get("/mcp/contexts/:id", (req, res) => {
  const r = getRecipeById(req.params.id);
  if (!r) return res.status(404).json({ error: "not found" });
  res.json({ context: recipeToContext(r) });
});

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`MCP server listening on http://localhost:${PORT}`);
});

