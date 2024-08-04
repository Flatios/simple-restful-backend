import express from "express";
import auth from "../controllers/auth.js";

const router = express.Router();

router.use("/register", auth.register);
router.use("/login", auth.login);
console.log('merhaba')

export default router;
