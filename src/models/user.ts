import { Database } from "../utils/functions";
import { Time } from "../utils/functions";

export interface userInterface {
    _id?: string;
    username?: string;
    email?: string;
    password?: string;
    verified?: number;
    createdAt?: string;
}

export const allUser = async(): Promise<userInterface | null> => {
    const [ query ] = await Database.createQuery(`SELECT * FROM users`);
    return query[0]? Promise.resolve(query[0]) : Promise.resolve(null);
}

export const getUser = async (fields: userInterface): Promise<userInterface | false> => {
    const [ query ] = await Database.createQuery(`SELECT * FROM users WHERE ${Database.fieldsToQuery(fields)}`);
    if (query[0]) {
        return Promise.resolve(query[0]);
    } else {
        return Promise.resolve(false);
    }
}

export const createUser = async (fields: userInterface): Promise<userInterface | null> => {
    const colums = "_id, username, email, password, verified, createdAt";
    fields.createdAt = Time.getCurrentDate();

    const [ query ] = await Database.createQuery(`INSERT INTO users (${colums}) VALUES ( ?, ?, ?, ?, ?, ?)`, Object.values(fields));
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null)
}

export const deleteUser = async (id: string): Promise<userInterface | null> => {
    const [ query ] = await Database.createQuery(`DELETE FROM users WHERE _id = ?`, [id]);
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}

export const updateUser = async (fields: userInterface, findUser: userInterface): Promise<userInterface | null> => {
    const [ query ] = await Database.createQuery( 
        `UPDATE users SET ${Database.fieldsToQuery(fields).trim()} WHERE ${Database.fieldsToQuery(findUser).trim()}`);
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}
