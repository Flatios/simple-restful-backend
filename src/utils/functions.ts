import pool from "./database";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from 'bcrypt';

// Generator
export class Generator {
    static uuid = () => {
        const timestamp = Date.now().toString(16);
        const randomPart = () => Math.random().toString(16).slice(2, 6);
        return `${randomPart()}${randomPart()}-${randomPart()}-${randomPart()}-${randomPart()}-${randomPart()}${timestamp}`;
    }
    static random = (list: string[]) => {
        return list[Math.floor[Math.random() * list.length]];
    }

    static otp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

// JWT Functions
export class Jwt {
    static createToken = (id: string, options = { expiresIn: "1h" }) => jsonwebtoken.sign({ id }, process.env.SECRET_TOKEN, options);
    static verifyToken = (token: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, process.env.SECRET_TOKEN, (err, data) => {
                if (err) reject(new Error(err.message)); else resolve(data); 
            });
        });
    }
}

// Hash Functions
export class Hash {
    static async createHash(text: string, saltRounds = 10): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(text, salt);
            return hash;
        } catch (err) {
            throw new Error(err);
        }
    }

    static async verifyHash(text: string, hashed: string): Promise<boolean> {
        try {
            const result = await bcrypt.compare(text, hashed);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }
}

// Time Functions
export class Time {
    static getCurrentDate = () => {
        return new Date().toISOString().slice(0, 10);
    }
    static HoursToDate = (duration: number) => {
        return (Date.now() + 3600000 * + duration).toString();
    }
}

// Database Functions 
export class Database {
    static fieldsToQuery = (fields: any) => Object.entries(fields).map(([key, value]) => `${key} = '${value}'`).join(', ');
    static createQuery = async (query: string, values?: string[]) => await pool.query(query, values);
    static getNumberInTable = async (query: string) => {

    }
}
