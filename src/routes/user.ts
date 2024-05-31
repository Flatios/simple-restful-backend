import { Router } from "express";
import { Register, Login, fetchUser, removeUser, forgotPassword } from "../controllers/user"

const router: Router = Router();

// User Simple Routes
router.post("/user/register", Register);
router.post("/user/login", Login);
router.delete("/user/:id", removeUser);
router.get("/user/:id", fetchUser);

// User Otp Routes
router.post("/user/forgot-password", forgotPassword);


export default router;
