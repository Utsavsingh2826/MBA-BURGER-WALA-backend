import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { connectPassport } from "./utils/Provider.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
const app = express();
dotenv.config({ path: "./config/config.env" });
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({
  extended:true,
}))
// Middleware: Initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Session secret for secure cookies
    resave: false,                     // Don't save session if unmodified
    saveUninitialized: false,          // Don't create empty sessions
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Connect Passport.js strategies
connectPassport();

// Define routes
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);



app.use(errorMiddleware)
export default app;
