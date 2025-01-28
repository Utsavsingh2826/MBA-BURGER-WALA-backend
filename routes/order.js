import express from 'express'
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
const router = express.Router();
import {placeOrder,getMyOrders, getOrderDetails, getAdminOrders, processOrder, placeOrderOnline, paymentVerification} from "../controllers/order.js"

router.post("/createorder", placeOrder)
router.post("/createorderonline", isAuthenticated, placeOrderOnline);

router.post("/paymentverification", paymentVerification);
router.get("/myorders", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getOrderDetails);
router.get("/admin/orders", isAuthenticated,authorizeAdmin,  getAdminOrders);
router.get("/admin/orders/:id", isAuthenticated, processOrder);

export default router;
