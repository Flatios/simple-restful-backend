import pool from "../config/database.config.js";

function generateSetClause(data) {
    if (typeof data !== 'object' || data === null) {
        console.warn('Data parameter must be an object');
        return '';
    }
    return Object.keys(data).map(key => `${key} = ?`).join(', ');
}

function generateWhereClause(criteria, conjunction = 'AND') {
    if (typeof criteria !== 'object' || criteria === null) {
        console.warn('Criteria parameter must be an object');
        return '';
    }
    return Object.keys(criteria).map(key => `${key} = ?`).join(` ${conjunction} `);
}

async function findOne(tableName, criteria) {
    if (criteria === null) {
        console.warn('Criteria parameter cannot be null');
        return null;
    }
    const query = `SELECT * FROM ${tableName} WHERE ${generateWhereClause(criteria, "OR")}`;
    const values = Object.values(criteria);

    try {
        const [results] = await pool.query(query, values);
        return results.length > 0? results[0] : null;
    } catch (err) {
        console.error('Error finding record:', err);
        throw err;
    }
}

async function insertOne(tableName, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    const values = Object.values(data);

    try {
        const [results] = await pool.query(query, values);
        return results.affectedRows > 0;
    } catch (err) {
        console.error('Error inserting record:', err);
        throw err;
    }
}

async function updateOne(tableName, data, criteria) {
    const setClause = generateSetClause(data);
    const whereClause = generateWhereClause(criteria);
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(data), ...Object.values(criteria)];

    try {
        const [results] = await pool.query(query, values);
        return results.affectedRows > 0;
    } catch (err) {
        console.error('Error updating record:', err);
        throw err;
    }
}

async function deleteOne(tableName, criteria) {
    const whereClause = generateWhereClause(criteria);
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const values = Object.values(criteria);

    try {
        const [results] = await pool.query(query, values);
        return results.affectedRows > 0;
    } catch (err) {
        console.error('Error deleting record:', err);
        throw err;
    }
}

export default {
    findOne,
    insertOne,
    updateOne,
    deleteOne
};
