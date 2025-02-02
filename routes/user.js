import express from 'express'
import passport from 'passport'
import { myProfile, logout,getAdminUsers } from '../controllers/user.js';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';
import { getAdminStats } from '../controllers/order.js';



const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect:'http://localhost:3000/me' 
  })
);

router.get("/me", isAuthenticated, myProfile)
router.get("/logout", logout)
 router.get("/admin/users",isAuthenticated,authorizeAdmin,getAdminUsers)
 router.get("/admin/stats",isAuthenticated,getAdminStats)
export default router;