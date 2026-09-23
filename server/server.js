const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const { MongoClient } = require('mongodb');
const { createApp } = require('./app');

async function startServer() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in server/.env, or use npm run demo from the project root.');
  const port = Number(process.env.PORT || 9000);
  const client = new MongoClient(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, socketTimeoutMS: 10000 });
  try {
    await client.connect();
    const users = client.db(process.env.DB_NAME || 'pa2').collection('users');
    await users.createIndex({ username: 1 }, { unique: true });
    console.log('Connected to MongoDB');
    const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((origin) => origin.trim());
    const app = createApp(users, { origins });
    const server = await new Promise((resolve, reject) => {
      const listener = app.listen(port, '127.0.0.1', () => resolve(listener));
      listener.once('error', reject);
    });
    console.log(`Server running at http://localhost:${port}`);
    let closing = false;
    async function close() {
      if (closing) return;
      closing = true;
      await new Promise((resolve) => server.close(resolve));
      await client.close();
    }
    process.once('SIGINT', close);
    process.once('SIGTERM', close);
    return { server, client, close };
  } catch (error) {
    await client.close();
    throw error;
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Could not start the server. Check MONGO_URI, Atlas network access, and PORT.');
    // Avoid logging a connection string or database credentials.
    console.error(error.name);
    process.exitCode = 1;
  });
}

module.exports = { startServer };
