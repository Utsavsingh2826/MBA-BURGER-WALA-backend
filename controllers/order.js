import { asyncError } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/Order.js";
import mongoose from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { instance } from "../server.js";
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


export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;

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

  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});

export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.create({
      ...orderOptions,
      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `Order Placed Successfully. Payment ID: ${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment Failed", 400));
  }
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name");

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
        order.deliveredAt =new Date(Date.now()) ;
      }
      
      else if (order.orderStatus === "Delivered") 
    return next (new ErrorHandler("Food already exists", 400));
      await order.save();

      res.status(200).json({
        success: true,
        order,
      });
    })

export const getAdminStats = asyncError(async(req,res,next)=>{
  const usersCount = await User.countDocuments();
  const orders = await Order.find({});
  const preparingOrders = orders.filter((i)=>{
    i.orderStatus === "Preparing"
  });
  const shippedOrders = orders.filter((i)=>{
    i.orderStatus === "Shipped"
  });
  const deliveredOrders = orders.filter((i)=>{
    i.orderStatus === "Delivered"
  });
   let totalincome = 0;
   orders.forEach((i)=>{
    totalincome += i.totalAmount;
   })
    res.status(200).json({
      success:true,
      usersCount, 
      totalincome,
      ordersCount:{
        total:orders.length,
        preparing:preparingOrders.length,
        shipped:shippedOrders.length,
           delivered : deliveredOrders.length
      }
    })
})