import { Database } from "../utils/function";
import { Time } from "../utils/function";

interface user {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    verified?: boolean;
    createdAt?: string;
}

export const allUser = (): Promise<user | null> => {
    const query = Database.createQuery(`SELECT * FROM users`);
    return query[0]? Promise.resolve(query[0]) : Promise.resolve(null);
}

export const getUser = (fields: user): Promise<user | null> => {
    const query = Database.createQuery(`SELECT * FROM users WHERE ?`, [Database.fieldsToQuery(fields)]);
    return query[0]? Promise.resolve(query[0]) : Promise.resolve(null);
}

export const createUser = async (fields: user): Promise<user | null> => {
    const colums = "_id, username, email, password, verified, createdAt";
    const query = await Database.createQuery(`INSERT INTO users (${colums}) VALUES ( ?, ?, ?, ?, ?, ${Time.getCurrentDate()} )`, Object.values(fields));
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}

export const deleteUser = (id: string): Promise<user | null> => {
    const query = Database.createQuery(`DELETE FROM users WHERE _id = ?`, [id]);
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}

export const updateUser = async (fields: user, findUser: user): Promise<user | null> => {
    const query = Database.createQuery( `UPDATE users SET ${Database.fieldsToQuery(fields).trim()} WHERE ${Database.fieldsToQuery(findUser).trim()}`, [] );
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}
