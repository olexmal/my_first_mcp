import { recipes } from "../data/recipes";
import { Recipe } from "../types";

export function listRecipes(): Pick<Recipe, "id" | "title" | "tags">[] {
  return recipes.map((r) => ({ id: r.id, title: r.title, tags: r.tags }));
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function searchByTag(tag: string): Recipe[] {
  const t = tag.toLowerCase();
  return recipes.filter((r) => (r.tags || []).some((tg) => tg.toLowerCase() === t));
}

