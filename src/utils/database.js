import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        console.log('Database connection pool successfully created and tested');
        connection.release();
    } catch (error) {
        console.error('Error creating or testing database connection pool:', error.message);
    }
}

testConnection();

export default pool;