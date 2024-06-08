import { Request, Response, NextFunction } from "express"
import { Jwt } from "../utils/function";
import { getUser } from "../models/user";

export = async(req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(400).json({ message: "Token is missing" });
    }
    
    try {
        const decodedToken = await Jwt.verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }
    
        const user = await getUser({ _id: decodedToken.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification or user retrieval failed", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}