import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const added_by: string = (req as any).user.name;
    const category = await prisma.category.create({
      data: { name, description, added_by, updated_by: null },
    });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const limit = Math.max(1, parseInt(String(req.query.limit)) || 10);
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({ skip, take: limit, orderBy: { created_at: "desc" } }),
      prisma.category.count(),
    ]);

    res.status(200).json({
      message: "List of all categories",
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Category ID is missing" });
    }
    const { name, description } = req.body;
    const updated_by: string = (req as any).user.name;
    const category = await prisma.category.update({
      where: { id },
      data: { name, description, updated_by },
    });
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Category ID is missing" });
    }
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
