
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'ai_challenge',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Admin123',
});

const schema = process.env.DB_SCHEMA || 'reto_c';

pool.on('connect', (client) => {
  client.query(`SET search_path TO ${schema}`);
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

/**
 * Execute a parameterized query against the pool.
 * @param {string} text  SQL query string
 * @param {any[]}  params Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB]', { text, duration: `${duration}ms`, rows: res.rowCount });
  }
  return res;
};

/**
 * Acquire a client from the pool (useful for transactions).
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
