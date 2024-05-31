import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jsonwebtoken from "jsonwebtoken";
import pool from "./database";

const scryptAsync = promisify(scrypt);

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
}

// JWT Functions
export class Jwt {
    static createToken = ( id: string, options={ expiresIn: "1h" } ) => { 
        return jsonwebtoken.sign({ id }, process.env.SECRET_TOKEN, options); 
    }
    static verifyToken = ( token: string ) => { 
        return jsonwebtoken.verify(token, process.env.SECRET_TOKEN); 
    }
}

// Hash Functions
export class Hash {
    static createHash = async ( text: string ) => {
        const salt = randomBytes(Number(process.env.HASH_SALT)).toString("hex");
        const buffer = (await scryptAsync(text, salt, 64)) as Buffer;
        return `${buffer.toString("hex")}.${salt}`;
    }
    static verifyHash = async ( hashed: string, text: string ) => {
        const hashedPasswordBuf = Buffer.from(hashed, "hex");
        const suppliedPasswordBuf = (await scryptAsync(text, process.env.HASH_SALT, 64)) as Buffer;
        return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
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
    static fieldsToQuery = (fields: any) => Object.entries(fields).map(([key, value]) => `${key} = '${value}'` ).join(', ');
    static createQuery = async (query: string, values?: string[]) => await pool.query(query, values);
}

