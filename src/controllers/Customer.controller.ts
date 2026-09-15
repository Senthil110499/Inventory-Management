import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const addCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    const userId = (req as any).user.id;

    if (!name || !email || !phoneNumber || !address) {
      return res.status(400).json({ error: "Name, email, and phone number are required fields." });
    }

    const newCustomer = await prisma.customer.create({
      data: { name, email, phone: phoneNumber, address, userId },
    });
    res.status(201).json({ message: "Customer added successfully.", newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const customers = await prisma.customer.findMany({ where: { userId } });

    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found for this user" });
    }

    res.status(200).json({ message: "list all customers for the user", data: customers });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await prisma.customer.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
