import { Request, Response } from "express";
import { Hash, Generator, Jwt } from "../utils/functions";
import { isValidEmail, isValidPassword } from "../utils/validation";
import { getUser, createUser, deleteUser, updateUser } from "../models/user";

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await getUser({ email });
    if (user) return res.status(409).json({ success: false, message: "This email is already in use" });

    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid or incorrectly formatted email" });
    if (!isValidPassword(password)) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number" });

    const userData = {
        _id: Generator.uuid(),
        username: username.trim().toLowerCase().replace(/\s/g, "-"),
        email: email,
        password: await Hash.createHash(password, 12),
        verified: 0
    }

    if (!createUser(userData)) return res.status(500).json({ success: false, message: "An error occurred while creating the user" });
    const userToken = Jwt.createToken(userData._id);

    return res.status(201).json({
        success: true, 
        message: "User created successfully",
        payload: { token: userToken, user: userData }
    });
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await getUser({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: "Invalid or incorrectly formatted email" });
    if (!isValidPassword(password)) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number" });

    const comparePassword = await Hash.verifyHash(password, user.password);
    if (!comparePassword) return res.status(401).json({ success: false, message: "Incorrect email or password" });

    const userToken = Jwt.createToken(user._id);
    return res.status(200).json({
        success: true, 
        message: "User authenticated successfully",
        payload: { token: userToken, user }
    });
}


export const verifyToken = async (req: Request, res: Response) => {
    try {
        const token = req.body.token?.toString();

        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }

        const decodedToken = await Jwt.verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid token" });
        }
    
        const user = await getUser({ _id: decodedToken.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            message: "Token verified successfully",
            payload: {token, user}
       }).status(200)
    } catch (err) {
        throw new Error(err);
    }
}
