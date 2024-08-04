import mysql from 'mysql2/promise';
import config from './config.js';

const pool = mysql.createPool(config.database);

async function checkConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection refused. Make sure the database server is running.');
            process.exit(1);
        }
        console.error('Error connecting to the database:', err);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

checkConnection().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(0)
});

process.on('SIGINT', async () => {
    console.log('Closing database connection pool...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Closing database connection pool...');
    await pool.end();
    process.exit(0);
});

export default pool;