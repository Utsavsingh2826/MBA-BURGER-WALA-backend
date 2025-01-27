import express from 'express'
import passport from 'passport'
import { myProfile, logout } from '../controllers/user.js';
import { isAuthenticated } from '../middlewares/auth.js';



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
    successRedirect:'/' 
  })
);

router.get("/me", isAuthenticated, myProfile)
router.get("/logout", logout)

export default router;