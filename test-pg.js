const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Supabase pooler
});
client.connect()
  .then(() => console.log('✅ Connected to Supabase!'))
  .then(() => client.query('UPDATE "User" SET approved = NOT approved WHERE id = \'cmqm6iwpc0000jsvojshocg8f\' RETURNING id, email, approved'))
  .then(res => {
    console.log('Update result:');
    console.log(res.rows);
  })
  .catch(err => console.error('❌ Error:', err.message))
  .finally(() => client.end());