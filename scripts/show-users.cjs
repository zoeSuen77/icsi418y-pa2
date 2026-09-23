const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env'), quiet: true });
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.argv.includes('--local') ? 'mongodb://127.0.0.1:27018' : process.env.MONGO_URI;
  if (!uri) throw new Error('Configure server/.env, or use npm run db:users -- --local while the demo runs.');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const users = await client.db(process.argv.includes('--local') ? 'pa2' : (process.env.DB_NAME || 'pa2')).collection('users').find({}).limit(20).toArray();
    console.log(JSON.stringify(users, null, 2));
  } finally { await client.close(); }
}
main().catch((error) => { console.error('Could not read MongoDB users:', error.name); process.exitCode = 1; });
