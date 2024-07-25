import 'dotenv/config';

export default {
    database: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3006
    },
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT || 3000
  };