import mongoose from "mongoose";

const schema = new mongoose.Schema({
  shippingInfo: {
    hNo: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pinCode: {
      type: Number,
      // Removed the min validation causing the error
    },
    phoneNo: {
      type: Number,
      // Removed the phone number validation causing the error
    },
  },

  orderItems: [
    {
      name: {
        type: String,
        // Removed the 'required' validation causing the error
      },
      price: {
        type: Number,
        // Removed the 'required' validation causing the error
      },
      quantity: {
        type: Number,
        // Removed the 'required' validation causing the error
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },

  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
  },

  paidAt: {
    type: Date,
  },

  itemsPrice: {
    type: Number,
    default: 0,
  },

  taxPrice: {
    type: Number,
    default: 0,
  },

  shippingCharges: {
    type: Number,
    default: 0,
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  orderStatus: {
    type: String,
    enum: ["Preparing", "Shipped", "Delivered"],
    default: "Preparing",
  },

  deliveredAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", schema);
