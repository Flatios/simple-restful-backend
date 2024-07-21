import { Router } from "express";
import { register, login, verifyToken } from "../controllers/user";

const router: Router = Router();

// Authentication
router.post("/register", register);
router.post("/login", login);

// Verify
router.post("/verify/token", verifyToken);


export default router;
