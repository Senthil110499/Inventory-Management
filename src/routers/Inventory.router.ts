import express from "express";
import {
  addInventoryItem,
  deleteInventoryItem,
  getAllInventoryItems,
  updateInventoryItem,
} from "../controllers/Inventory.controller.js";

const router = express.Router();

router.post("/add", addInventoryItem);
router.get("/inventory", getAllInventoryItems);
router.put("/edit/:id", updateInventoryItem);
router.delete("/delete/:id", deleteInventoryItem);

export default router;
