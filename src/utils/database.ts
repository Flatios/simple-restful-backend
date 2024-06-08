import {createConnection} from 'mysql2'; 

const pool = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});

pool.connect(function (err: Error) {
    if (err) throw err;

    console.log('Database connection pool succesfully created');
});

export default pool.promise();
