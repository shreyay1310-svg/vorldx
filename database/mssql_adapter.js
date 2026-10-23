/**
 * WorldX Attendance 360 (VorldX Industries Pvt Ltd)
 * Microsoft SQL Server Database Adapter (mssql / T-SQL)
 * Compatible with: SQL Server 2016-2022, Azure SQL Database, AWS RDS SQL Server
 */

const sql = require('mssql');

// SQL Server Connection Configuration
// Values can be set in .env or via standard environment variables
const config = {
  server: process.env.SQLSERVER_HOST || 'localhost',
  port: parseInt(process.env.SQLSERVER_PORT || '1433', 10),
  user: process.env.SQLSERVER_USER || 'sa',
  password: process.env.SQLSERVER_PASSWORD || 'WorldX@2026!Secure',
  database: process.env.SQLSERVER_DATABASE || 'WorldX_Attendance360',
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === 'true', // true for Azure, false for local dev
    trustServerCertificate: process.env.SQLSERVER_TRUST_CERT !== 'false', // true for self-signed local certs
    enableArithAbort: true,
    connectTimeout: 15000,
    requestTimeout: 30000
  },
  pool: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000
  }
};

let poolPromise = null;

/**
 * Get or initialize the singleton Connection Pool
 */
async function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log(`[SQL Server] Connected successfully to ${config.server}:${config.port}/${config.database}`);
        return pool;
      })
      .catch(err => {
        console.error('[SQL Server] Connection pool error:', err.message);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

/**
 * Execute a parameterized T-SQL Query
 * @param {string} queryString - T-SQL query string with @param placeholders
 * @param {Object} [params] - Object containing parameter key-values { paramName: value }
 * @returns {Promise<Array>} - Array of record rows
 */
async function query(queryString, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const [key, val] of Object.entries(params)) {
    request.input(key, val);
  }

  const result = await request.query(queryString);
  return result.recordset || [];
}

/**
 * Execute a single query returning first row or null
 */
async function queryOne(queryString, params = {}) {
  const rows = await query(queryString, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute a Stored Procedure
 * @param {string} procName - e.g. 'dbo.sp_MarkAttendance'
 * @param {Object} [params] - Stored procedure input parameters
 * @returns {Promise<{ recordset: Array, output: Object, returnValue: any }>}
 */
async function executeProc(procName, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const [key, val] of Object.entries(params)) {
    request.input(key, val);
  }

  const result = await request.execute(procName);
  return {
    recordset: result.recordset || [],
    output: result.output,
    returnValue: result.returnValue
  };
}

/**
 * Quick Health Check / Ping
 */
async function testConnection() {
  try {
    const res = await query('SELECT @@VERSION AS ServerVersion, DB_NAME() AS CurrentDB, GETDATE() AS ServerTime');
    return { success: true, info: res[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Gracefully close pool on app termination
 */
async function closePool() {
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
    poolPromise = null;
    console.log('[SQL Server] Connection pool closed.');
  }
}

module.exports = {
  sql,
  config,
  getPool,
  query,
  queryOne,
  executeProc,
  testConnection,
  closePool
};
