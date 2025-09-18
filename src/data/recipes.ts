import { Recipe } from "../types";

export const recipes: Recipe[] = [
  {
    id: "chocolate-cake",
    title: "Simple Chocolate Cake",
    ingredients: [
      "1 3/4 cups (220g) all-purpose flour",
      "2 cups (400g) granulated sugar",
      "3/4 cup (75g) unsweetened cocoa powder",
      "1 1/2 tsp baking powder",
      "1 1/2 tsp baking soda",
      "1 tsp salt",
      "2 large eggs",
      "1 cup (240ml) whole milk",
      "1/2 cup (120ml) vegetable oil",
      "2 tsp vanilla extract",
      "1 cup (240ml) boiling water"
    ],
    steps: [
      "Preheat oven to 350°F (175°C). Grease and flour two 9-inch cake pans.",
      "In a large bowl, whisk together flour, sugar, cocoa, baking powder, baking soda, and salt.",
      "Add eggs, milk, oil, and vanilla. Beat for 2 minutes on medium speed.",
      "Stir in boiling water (batter will be thin).",
      "Pour batter evenly into prepared pans.",
      "Bake 30-35 minutes or until a toothpick comes out clean.",
      "Cool in pans 10 minutes, then remove to wire racks to cool completely.",
      "Frost as desired and serve."
    ],
    prepTimeMinutes: 60,
    servings: 8,
    tags: ["dessert", "cake", "chocolate"]
  }
];

