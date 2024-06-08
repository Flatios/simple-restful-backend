import { Request, Response, NextFunction } from "express"
import { Jwt } from "../utils/function";
import { getUser } from "../models/user";

export = async(req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) return res.status(500).json({ message: "Invalid token"});

    const UserToken = await Jwt.verifyToken(token);
    if (!UserToken) return res.status(500).json({ message: "token cannot be used" });

    const user = await getUser({ _id: UserToken.id }); 
    if (!user) return res.status(500).json({ message: "user not found" });

    req.user = user;
    next();
}