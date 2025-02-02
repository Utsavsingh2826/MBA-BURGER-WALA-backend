import app from './app.js'

import {connectDB} from "./config/database.js"
connectDB();  
import Razorpay from "razorpay";
connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
app.get('/',(req,res,next)=>{
    res.send("<h1>Working</h1>") 
})   
app.listen(process.env.Port, ()=>{
    console.log(`Server is working on ${process.env.Port} in ${process.env.NODE_ENV}`)
}
)       