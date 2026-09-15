import express from "express";
import cors from "cors";
import connectDB from "./database/Dbconfig.js";
import userRouter from "./src/routers/User.router.js";
import customerRouter from "./src/routers/Customer.router.js";
import { isAuthenticated } from "./middleware/Auth.middleware.js";
import categoryRouter from "./src/routers/Category.router.js";
import inventoryRouter from "./src/routers/Inventory.router.js";
import orderRouter from "./src/routers/Order.router.js";
import billRouter from "./src/routers/Bill.router.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/customer", isAuthenticated, customerRouter);
app.use("/api/v1/category", isAuthenticated, categoryRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/order", isAuthenticated, orderRouter);
app.use("/api/v1/bill", isAuthenticated, billRouter);

app.get('/', (req, res) => {
    res.status(200).send(`<div style="text-align: center; background-color:purple;  padding: 10px;"><h1> Inventory Billing App</h1></div>`)
});


app.listen(port, () => {
    console.log("App is listening with port",port);
});


