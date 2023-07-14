import express from "express";

import { protect, admin } from "../middleware/authmiddleware.js";
import * as categoryController from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:slug", categoryController.getCategory);
router.post("/", protect, admin, categoryController.createCategory);
router.put("/:id", protect, admin, categoryController.updateCategory);
router.delete("/:id", protect, admin, categoryController.deleteCategory);

export default router;
