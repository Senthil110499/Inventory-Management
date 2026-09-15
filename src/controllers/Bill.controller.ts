import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const createBillFromOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        customer: true,
        items: { include: { inventory: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const billItems = order.items.map((item) => ({
      inventoryId: item.inventoryId,
      quantity: item.quantity,
      price: item.inventory.price,
    }));

    const totalAmount = billItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const bill = await prisma.bill.create({
      data: {
        orderId: parseInt(orderId),
        userId,
        customerId: order.customerId,
        totalAmount,
        items: { create: billItems },
      },
      include: {
        customer: true,
        items: { include: { inventory: { select: { name: true } } } },
      },
    });

    res.status(201).json({
      message: "Bill created successfully",
      bill: {
        id: bill.id,
        order: bill.orderId,
        customer: {
          id: bill.customer.id,
          name: bill.customer.name,
          email: bill.customer.email,
          address: bill.customer.address,
          phone: bill.customer.phone,
        },
        items: bill.items,
        totalAmount: bill.totalAmount,
        date: bill.date,
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBills = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bills = await prisma.bill.findMany({
      where: { userId },
      include: {
        customer: { select: { name: true, email: true, address: true, phone: true } },
        items: { include: { inventory: { select: { name: true } } } },
      },
    });
    res.status(200).json({ message: "List of all bills", bills });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBill = await prisma.bill.findUnique({ where: { id: parseInt(id) } });
    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    await prisma.bill.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
