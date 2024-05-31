import { Request, Response } from "express"
import { Hash, Generator, Jwt } from "../utils/function";
import { isValidEmail, isValidPassword } from "../utils/validate";

import { getUser, createUser, deleteUser } from "../models/user";
import {sendOTP, verifyOTP} from "../models/otp";

export const fetchUser = async(req: Request, res: Response) => {
    const { _id } = req.params;

    const user = await getUser({ _id });
    if (!user) return res.status(500).json({ message: "Such user not found"});

    delete user.password;
    
    return res.status(200).json({ 
        message: "User found successfully", 
        payload: user 
    });
}

export const removeUser = async(req: Request, res: Response) => {
    const { _id } = req.params;

    const user = await getUser({ _id });
    if (!user) return res.status(500).json({ message: "Such user not found"});

    if (!deleteUser(user._id)) return res.status(500).json({ message: "An error occurred while deleting a user"});

    return res.status(200).json({ 
        message: "User deleted successfully", 
        payload: user 
    });
}

export const Register = async(req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await getUser({ email });
    if (user) return res.status(500).json({ message: "this email has been used"});

    if (!isValidEmail(email)) return res.status(500).json({ message:  "This email is unusable or not formatted correctly"});
    if (!isValidPassword(password)) res.status(500).json({ message: "At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number for the password"});

    const userData = { 
        username: username.trim().toLowerCase().replace(/\s/g, "-"), 
        email: email, 
        password: await Hash.createHash(password), 
        _id: Generator.uuid() 
    }

    if (!createUser(userData)) res.status(500).json({ message: "An error occurred while creating a user"});
    const userToken = Jwt.createToken(userData._id);

    return res.status(200).header('Authorization', userToken).json({ 
        message: "User created successfully", 
        payload: { userToken, user: userData } 
    });
}

export const Login = async(req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await getUser({ email });
    if (!user) res.status(500).json({ message: "Such user not found"});

    if (!isValidEmail(email)) res.status(500).json({ message: "This email is unusable or not formatted correctly"});
    if (!isValidPassword(password)) res.status(500).json({ message: "At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number for the password"});

    const comparePassword = Hash.verifyHash(user.password, password);
    if (!comparePassword) res.status(500).json({ message: "Your email or password is incorrect"});

    const userToken = Jwt.createToken(user._id);
    return res.status(201).header('Authorization', userToken).json({ 
        payload: { 
            userToken, user: user
        } 
    });
}

export const forgotPassword = async(req: Request, res: Response) => {
    const { _id } = req.body;
}