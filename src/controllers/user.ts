import { Request, Response } from "express";
import { Hash, Generator, Jwt } from "../utils/function";
import { isValidEmail, isValidPassword } from "../utils/validate";
import { getUser, createUser, deleteUser, updateUser } from "../models/user";

export const Register = async(req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const user = await getUser({ email });
    if (user) return res.status(500).json({ message: "this email has been used"});

    if (!isValidEmail(email)) return res.status(500).json({ message:  "This email is unusable or not formatted correctly"});
    if (!isValidPassword(password)) return res.status(500).json({ message: "At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number for the password"});

    const userData = { 
        _id: Generator.uuid(),
        username: username.trim().toLowerCase().replace(/\s/g, "-"), 
        email: email, 
        password: await Hash.createHash(password, 12), 
        verified: 0
    }

    if (!createUser(userData)) return res.status(500).json({ message: "An error occurred while creating a user"});
    const userToken = Jwt.createToken(userData._id);

    return res.status(200).cookie('token', userToken).json({ 
        message: "User created successfully", 
        payload: { userToken, user: userData }
    });
}

export const Login = async(req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await getUser({ email });
    if (!user) return res.status(500).json({ message: "Such user not found"});

    if (!isValidEmail(email)) return res.status(500).json({ message: "This email is unusable or not formatted correctly"});
    if (!isValidPassword(password)) return res.status(500).json({ message: "At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number for the password"});

    const comparePassword = await Hash.verifyHash(password, user.password);
    if (!comparePassword) return res.status(500).json({ message: "Your email or password is incorrect"});

    const userToken = Jwt.createToken(user._id);
    return res.status(201).cookie('token', userToken).json({ 
        message: "user found successfully",
        payload: { 
            userToken, user
        } 
    });
}

export const LogOut = async(req: Request, res: Response) => {
    if (!req.user) return res.status(500).json({ message: "user data is not valiable"})

    res.clearCookie('token');
    return res.status(200).json({ 
        message: "User logged out successfully", 
        payload: req.user
    });
}
