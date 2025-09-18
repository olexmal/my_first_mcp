import { listRecipes, getRecipeById, searchByTag } from "./services/recipeService";

function main() {
  console.log("Recipes (summary):");
  const summaries = listRecipes();
  summaries.forEach((s) => {
    const tagSuffix = s.tags ? ` [${s.tags.join(", ")}]` : "";
    console.log(`- ${s.id}: ${s.title}${tagSuffix}`);
  });

  console.log("\nFull recipe: chocolate-cake");
  const cake = getRecipeById("chocolate-cake");
  if (cake) {
    console.log(`Title: ${cake.title}`);
    console.log(`Servings: ${cake.servings ?? "n/a"}`);
    console.log(`Prep time: ${cake.prepTimeMinutes ?? "n/a"} minutes`);
    console.log("Ingredients:");
    cake.ingredients.forEach((ing) => console.log(`  - ${ing}`));
    console.log("Steps:");
    cake.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  } else {
    console.log("Recipe not found.");
  }

  console.log("\nSearch by tag: 'dessert'");
  const desserts = searchByTag("dessert");
  desserts.forEach((d) => console.log(`- ${d.title}`));
}

main();
