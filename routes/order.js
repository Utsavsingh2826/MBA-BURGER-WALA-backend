import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();
import {placeOrder,getMyOrders, getOrderDetails, getAdminOrders, processOrder} from "../controllers/order.js"

router.post("/createorder", isAuthenticated, placeOrder)

router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getOrderDetails);
router.get("/admin/orders", isAuthenticated, getAdminOrders);
router.get("/admin/orders/:id", isAuthenticated, processOrder);

export default router;
