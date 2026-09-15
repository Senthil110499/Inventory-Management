import { Request, Response } from "express";
import prisma from "../config/prisma.js";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const { customer: customerId, items } = req.body;
    const userId = (req as any).user.id;

    console.log("Received Customer ID:", customerId);

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(customerId) },
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let total = 0;
    const itemDetails = [];
    const quantities = new Map<number, number>();

    for (const orderItem of items) {
      const inventoryId = parseInt(orderItem.item);
      const quantity = Number(orderItem.quantity);
      const inventory = await prisma.inventory.findUnique({
        where: { id: inventoryId },
      });
      if (!inventory) {
        return res.status(404).json({ message: "Item not found" });
      }
      if (quantity > inventory.quantity) {
        return res.status(400).json({ message: "Insufficient quantity for the item" });
      }
      const itemTotal = inventory.price * quantity;
      total += itemTotal;
      quantities.set(inventoryId, quantity);
      itemDetails.push({
        name: inventory.name,
        price: inventory.price,
        quantity,
        itemTotal,
      });
    }

    for (const [inventoryId, quantity] of quantities) {
      await prisma.inventory.update({
        where: { id: inventoryId },
        data: { quantity: { decrement: quantity } },
      });
    }

    await prisma.order.create({
      data: {
        customerId: parseInt(customerId),
        userId,
        total,
        items: {
          create: items.map((orderItem: any) => ({
            inventoryId: parseInt(orderItem.item),
            quantity: Number(orderItem.quantity),
          })),
        },
      },
    });

    res.status(201).json({
      message: "Order placed successfully",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
      },
      items: itemDetails,
      total,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        customer: true,
        items: {
          include: {
            inventory: { select: { name: true, price: true } },
          },
        },
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "List of all orders for the user", orders });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await prisma.order.delete({ where: { id: orderId } });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
