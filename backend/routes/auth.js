import express from "express";

import { login } from "../controllers/auth.js";
import { register } from "../controllers/auth.js";
import {  logout } from "../controllers/auth.js";
import { validate } from "../controllers/auth.js";



const router = express.Router();

router.post("/login",login);
router.post("/register",register);
router.post("/logout", logout);
router.get("/validate",validate);

router.get("/register",(req,res)=>{
      res.send("register check");
})



export default router;