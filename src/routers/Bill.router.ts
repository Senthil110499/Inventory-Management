import express from "express";
import { createBillFromOrder, deleteBill, getAllBills } from "../controllers/Bill.controller.js";

const router = express.Router();

router.post("/create", createBillFromOrder);
router.get("/bills", getAllBills);
router.delete("/delete/:id", deleteBill);

export default router;
