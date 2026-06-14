const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Supabase pooler
});
client.connect()
  .then(() => console.log('✅ Connected to Supabase!'))
  .then(() => client.query('SELECT 1'))
  .then(res => console.log('Query result:', res.rows))
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());