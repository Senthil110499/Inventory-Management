import express from "express";
import { addCategory, deleteCategory, editCategory, getAllCategories } from "../controllers/Category.controller.js";

const router = express.Router();

router.post("/add", addCategory);
router.get("/categories", getAllCategories);
router.put("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
