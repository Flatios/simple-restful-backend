import express from "express";
import auth from "../controllers/auth.js";

const router = express.Router();

router.use("/register", auth.register);
router.use("/login", auth.login);

export default router;
