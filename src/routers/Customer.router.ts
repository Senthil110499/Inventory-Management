import express from "express";
import { addCustomer, getAllCustomers, deleteCustomer } from "../controllers/Customer.controller.js";

const router = express.Router();

router.post("/add", addCustomer);
router.get("/customers", getAllCustomers);
router.delete("/delete/:id", deleteCustomer);

export default router;
