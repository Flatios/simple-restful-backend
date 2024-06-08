import { Request, Response, NextFunction } from "express"
import { Jwt } from "../utils/function";
import { getUser } from "../models/user";

export = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.cookies;
    if (!authorization) return res.status(500).json({ message: "Invalid authorization"});

    const Token = authorization.split(' ')[1];

    const UserToken = Jwt.verifyToken(Token);
    if (!UserToken) return res.status(500).json({ message: "token cannot be used" });

    const user = getUser({ _id: UserToken }); 

    next();
}