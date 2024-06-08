import { Router } from "express";
import { Register, Login, LogOut } from "../controllers/user";
import authorization from "../middlewares/authorization";

const router: Router = Router();

// Authentication
router.post("/user/register", Register);
router.post("/user/login", Login);
router.post("/user/logout", LogOut);


export default router;
