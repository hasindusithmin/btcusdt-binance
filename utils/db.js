require('dotenv').config()
const { Pool } = require('pg');

let localPoolConfig = {
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: '5432',
    database: 'postgres'
};

const poolConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : localPoolConfig;

const pool = new Pool(poolConfig);

module.exports = pool;



