import { asyncError } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/Order.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  // Validate or set user as a valid ObjectId
  const user = req.user?._id; // Assuming `req.user` contains the authenticated user's info
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User ID is required and must be valid.",
    });
  }

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  try {
    const order = await Order.create(orderOptions);
    res.status(201).json({
      success: true,
      message: "Order placed successfully via cash",
      order,
    });
  } catch (err) {
    next(err); // Pass any errors to the error middleware
  }
});


export const getMyOrders = asyncError(async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
  
    console.log("User ID:", userId);
  
    const orders = await Order.find({ user: userId });
  
    console.log("Orders found:", orders);
  
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }
  
    res.status(200).json({
      success: true,
      orders,
    });
  });
  

  export const getOrderDetails = asyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name");
    
    // Check if the order exists
    if (!order) {
      return next(new ErrorHandler("Invalid order ID", 404)); // Handle invalid order ID
    }
    
    res.status(200).json({
      success: true,
      order, // Return the found order
    });
  });
  

  export const getAdminOrders = asyncError(async (req, res, next) => {
   
  
    
  
    const orders = await Order.find({ });
  
    console.log("Orders found:", orders);
  
    
  
    res.status(200).json({
      success: true,
      orders,
    });
  });
  
    export const processOrder = asyncError(async(req,res,next)=>{

      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Invalid order ID", 404)); // Handle invalid order ID
      }
      
      if(order.orderStatus === "Preparing") order.orderStatus= "Shipped";
      else if(order.orderStatus==="Shipped"){
        order.orderStatus ="Delivered";
        order.deliveredAt = Date.now;
      }
      
      else if (order.orderStatus === "Delivered") 
    return next (new ErrorHandler("Food already exists", 400));
      await order.save();

      res.status(200).json({
        success: true,
        order,
      });
    })