export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes?: number;
  servings?: number;
  tags?: string[];
}
