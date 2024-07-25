import pool from "../../config/database.config.js";

/**
 * Generates a SET clause for SQL UPDATE queries.
 * @param {Object} data - An object with keys as column names and values as column values.
 * @returns {string} - A SET clause string.
 */
function generateSetClause(data) {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data parameter must be an object');
    }
    return Object.keys(data).map(key => `${key} = ?`).join(', ');
}

/**
 * Generates a WHERE clause for SQL queries.
 * @param {Object} criteria - An object with keys as column names and values as column values.
 * @param {string} [conjunction='AND'] - The conjunction to use between conditions.
 * @returns {string} - A WHERE clause string.
 */
function generateWhereClause(criteria, conjunction = 'AND') {
    if (typeof criteria !== 'object' || criteria === null) {
        throw new Error('Criteria parameter must be an object');
    }
    return Object.keys(criteria).map(key => `${key} = ?`).join(` ${conjunction} `);
}

/**
 * finds a all record in a table.
 * @param {string} tableName - The table name.
 * @returns {Promise<Object|null>} - The found record or null if not found.
 */
async function findAll(tableName) {
    const query = `SELECT * FROM ${tableName}`;

    try {
        const [results] = await pool.query(query);
        return results.length > 0 ? results[0] : null;
    } catch (e) {
        console.error('Error finding record:', e.message);
        throw new Error('Failed to find record: ' + e.message);
    }
}

/**
 * Finds a single record in a table based on criteria.
 * @param {string} tableName - The table name.
 * @param {Object} criteria - An object with keys as column names and values as column values.
 * @returns {Promise<Object|null>} - The found record or null if not found.
 */
async function findOne(tableName, criteria) {
    const query = `SELECT * FROM ${tableName} WHERE ${generateWhereClause(criteria)}`;
    const values = Object.values(criteria);

    try {
        const [results] = await pool.query(query, values);
        return results.length > 0 ? results[0] : null;
    } catch (e) {
        console.error('Error finding record:', e.message);
        throw new Error('Failed to find record: ' + e.message);
    }
}

/**
 * Inserts a new record into a table.
 * @param {string} tableName - The table name.
 * @param {Object} data - An object with keys as column names and values as column values.
 * @returns {Promise<boolean>} - True if the record was inserted, false otherwise.
 */
async function insertOne(tableName, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    const values = Object.values(data);

    try {
        const [result] = await pool.query(query, values);
        return result.affectedRows > 0;
    } catch (e) {
        console.error('Error inserting record:', e.message);
        throw new Error('Failed to insert record: ' + e.message);
    }
}

/**
 * Updates a single record in a table based on criteria.
 * @param {string} tableName - The table name.
 * @param {Object} data - An object with keys as column names and values as column values to update.
 * @param {Object} criteria - An object with keys as column names and values as column values for criteria.
 * @returns {Promise<boolean>} - True if the record was updated, false otherwise.
 */
async function updateOne(tableName, data, criteria) {
    const setClause = generateSetClause(data);
    const whereClause = generateWhereClause(criteria);
    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(data), ...Object.values(criteria)];

    try {
        const [result] = await pool.query(query, values);
        return result.affectedRows > 0;
    } catch (e) {
        console.error('Error updating record:', e.message);
        throw new Error('Failed to update record: ' + e.message);
    }
}

/**
 * Deletes a single record from a table based on criteria.
 * @param {string} tableName - The table name.
 * @param {Object} criteria - An object with keys as column names and values as column values for criteria.
 * @returns {Promise<boolean>} - True if the record was deleted, false otherwise.
 */
async function deleteOne(tableName, criteria) {
    const whereClause = generateWhereClause(criteria);
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const values = Object.values(criteria);

    try {
        const [result] = await pool.query(query, values);
        return result.affectedRows > 0;
    } catch (e) {
        console.error('Error deleting record:', e.message);
        throw new Error('Failed to delete record: ' + e.message);
    }
}

export default {
    findAll,
    findOne,
    insertOne,
    updateOne,
    deleteOne,
};