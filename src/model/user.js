import { Time, Database } from '../utils/helpers.js';

const fetchAllUsers = async () => {
    try {
        const [rows] = await Database.createQuery('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        return null;
    }
};

const fetchUser = async (conditions) => {
    try {
        const query = `SELECT * FROM users WHERE ${Database.buildWhereClauseAnd(conditions)}`;
        const [rows] = await Database.createQuery(query, Object.values(conditions));
        return rows[0] || null;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        return null;
    }
};

const checkUserExists = async (columns) => {
    const queryParts = [];
    const values = [];

    Object.keys(columns).forEach(column => {
        queryParts.push(`${column} = ?`);
        values.push(columns[column]);
    });

    const query = `SELECT ${Object.keys(columns).join(', ')} FROM users WHERE ${queryParts.join(' OR ')}`;

    try {
        const [rows] = await Database.createQuery(query, values);
        const results = {};

        Object.keys(columns).forEach(column => {
            results[column] = rows.some(row => row[column] === columns[column]) ? true : false;
        });

        return results;

    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

const addUser = async (fields) => {
    try {
        const columns = Object.keys(fields).join(', ');
        const placeholders = Object.keys(fields).map(() => '?').join(', ');
        const query = `INSERT INTO users (${columns}) VALUES (${placeholders})`;

        const [result] = await Database.createQuery(query, Object.values(fields));
        return result.affectedRows === 1 ? fields : null;
    } catch (error) {
        console.error('Error creating user:', error.message);
        return null;
    }
};

const removeUser = async (id) => {
    try {
        const [result] = await Database.createQuery('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows === 1;
    } catch (error) {
        console.error('Error deleting user:', error.message);
        return false;
    }
};

const modifyUser = async (fields, conditions, onUpdate = false) => {
    try {
        if (onUpdate) { fields.updated_at = Time.getCurrentTimestamp() }
        const setClause = Database.buildSetClause(fields);
        const whereClause = Database.buildWhereClauseAnd(conditions);
        const query = `UPDATE users SET ${setClause} WHERE ${whereClause}`;

        const [result] = await Database.createQuery(query, [...Object.values(fields), ...Object.values(conditions)]);
        return result.changedRows === 1;
    } catch (error) {
        console.error('Error updating user:', error.message);
        return false;
    }
};

export default {
    fetchAllUsers,
    checkUserExists,
    fetchUser,
    addUser,
    removeUser,
    modifyUser
}
