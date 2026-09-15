import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const addInventoryItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    if (!category || !category.id) {
      return res.status(400).json({ message: "Category is required" });
    }
    const validCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });
    if (!validCategory) {
      return res.status(404).json({ message: "Invalid category ID" });
    }
    const inventoryItem = await prisma.inventory.create({
      data: { name, description, price: Number(price), quantity: parseInt(quantity), categoryId: category.id },
    });
    res.status(201).json({ message: "Inventory item created successfully", inventoryItem });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllInventoryItems = async (req: Request, res: Response) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      include: { category: true },
    });
    res.status(200).json({ message: "List of all inventory items", inventoryItems });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, category } = req.body;
    const inventoryItem = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: Number(price),
        quantity: parseInt(quantity),
        categoryId: typeof category === "object" ? category.id : category,
      },
    });
    res.status(200).json({ message: "Inventory item updated successfully", inventoryItem });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.inventory.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
