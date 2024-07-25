import mysql from 'mysql2/promise';
import config from './config';

// MySQL connection pool configuration
const pool = mysql.createPool({
    ...config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('Database connection pool successfully created and tested.');
    } catch (error) {
        console.error('Error creating or testing database connection pool:', error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

testConnection().catch(error => {
    console.error('Unexpected error during connection test:', error);
});

export default pool;