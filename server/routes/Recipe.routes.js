import express from "express";

import { protect } from "../middleware/authmiddleware.js";
import * as recipeController from "../controllers/RecipesController.js";

const router = express.Router();

router.get("/", recipeController.getRecipes);
router.get("/:recipeId", recipeController.getRecipeById);
router.get("/savedRecipes/:id", recipeController.getRecipesByUser); // Own recipes
router.get("/savedRecipes/ids/:id", recipeController.getSavedRecipes); // Saved recipes
router.put("/saveRecipe", protect, recipeController.saveRecipe);
router.put("/unsaveRecipe", protect, recipeController.unsaveRecipe);
router.post("/", protect, recipeController.createRecipe);
router.post("/:id/reviews", protect, recipeController.addReview);
router.delete(
  "/reviews/:recipeId/:reviewId",
  protect,
  recipeController.deleteReview
);
router.put("/like", protect, recipeController.likeRecipe);
router.put("/unlike", protect, recipeController.unlikeRecipe);
router.put("/:recipeId", protect, recipeController.updateRecipe);
router.delete("/:recipeId", protect, recipeController.deleteRecipe);

export default router;
