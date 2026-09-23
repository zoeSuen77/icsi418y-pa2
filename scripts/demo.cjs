// A real local mongod process; no Atlas credentials are needed for this development mode.
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { startServer } = require('../server/server');

const root = path.resolve(__dirname, '..');
let mongo;
let api;
let frontend;
let stopping = false;

async function stop() {
  if (stopping) return;
  stopping = true;
  const frontendClosed = frontend && frontend.exitCode === null ? new Promise((resolve) => {
    frontend.once('exit', resolve);
    frontend.kill('SIGTERM');
  }) : Promise.resolve();
  if (api) await api.close();
  await frontendClosed;
  if (mongo) await mongo.stop();
}

async function main() {
  const dbPath = path.join(root, '.local-data', 'mongo');
  fs.mkdirSync(dbPath, { recursive: true });
  mongo = await MongoMemoryServer.create({
    binary: { version: '7.0.14', downloadDir: path.join(root, '.cache', 'mongodb-binaries') },
    instance: { port: 27018, dbPath, storageEngine: 'wiredTiger', dbName: 'pa2' },
  });
  process.env.MONGO_URI = mongo.getUri();
  process.env.DB_NAME = 'pa2';
  process.env.PORT = '9000';
  api = await startServer();
  console.log(`Local MongoDB: ${mongo.getUri()} (database: pa2, collection: users)`);
  console.log('Demo data is saved in .local-data/mongo. Atlas mode: npm run dev.');
  const viteEntry = path.join(path.dirname(require.resolve('vite/package.json')), 'bin', 'vite.js');
  frontend = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1'], {
    cwd: path.join(root, 'client'), stdio: 'inherit', env: process.env,
  });
  frontend.once('exit', (code) => {
    if (!stopping) { process.exitCode = code || 0; stop(); }
  });
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

main().catch(async (error) => {
  console.error('Could not start the local demo:', error.name);
  console.error('Check internet access for the first MongoDB download and that ports 5173, 9000, and 27018 are free.');
  await stop();
  process.exitCode = 1;
});
