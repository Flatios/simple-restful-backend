import { Hash, Generator, Jwt, Time } from "../utils/helpers.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";
import userModel from "../model/user.js";

const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

export const register = async (req, res) => {
    const { username, email, password, full_name, date_of_birth } = req.body;

    if (!isValidEmail(email)) {
        return sendErrorResponse(res, 400, "Invalid or incorrectly formatted email.");
    }

    if (!isValidPassword(password)) {
        return sendErrorResponse(res, 400, "Password must be between 8 and 24 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
    }

    try {
        const existingUser = await userModel.checkUserExists({ email, username });
        if (existingUser.username || existingUser.email) {
            const conflictFields = [];
            if (existingUser.username) conflictFields.push('username');
            if (existingUser.email) conflictFields.push('email');
            
            const conflictMessage = `${conflictFields.slice(0, -1).join(', ')}${conflictFields.length > 1 ? ' and ' : ''}${conflictFields.slice(-1)}`;
            return sendErrorResponse(res, 409, `User with ${conflictMessage} already exists`);
        }

        const hashedPassword = await Hash.createHash(password, 12);
        const newUser = { 
            id: Generator.uuid(),
            username, 
            email, 
            password: hashedPassword, 
            full_name: full_name,
            date_of_birth
        };

        const addUserResult = await userModel.addUser(newUser);
        if (!addUserResult) {
            return sendErrorResponse(res, 500, "An error occurred while adding the user.");
        }

        const token = Jwt.createToken(newUser.id);

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            payload: { token, user: newUser }
        });
    } catch (err) {
        console.error(err);
        return sendErrorResponse(res, 500, "Internal server error.");
    }
};

export const login = async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        return sendErrorResponse(res, 400, "Email/username and password are required.");
    }

    if (email && !isValidEmail(email)) {
        return sendErrorResponse(res, 400, "Invalid email format.");
    }

    if (!isValidPassword(password)) {
        return sendErrorResponse(res, 400, "Invalid password format.");
    }

    try {
        const user = await getUser(email ? { email } : { username });
        if (!user || !(await Hash.verifyHash(password, user.password))) {
            if (user) {
                await updateUser({ failedLoginAttempts: user.failedLoginAttempts + 1 }, { id: user.id });
            }
            return sendErrorResponse(res, 401, "Invalid email/username or password.");
        }

        await updateUser({ lastLogin: Time.getCurrentTimestamp(), failedLoginAttempts: 0 }, { id: user.id });

        const token = Jwt.createToken(user.id);
        res.status(200).json({
            success: true,
            message: "User authenticated successfully.",
            payload: { token, user }
        });
    } catch (err) {
        console.error(err);
        return sendErrorResponse(res, 500, "Internal server error.");
    }
};