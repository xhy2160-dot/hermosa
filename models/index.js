'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // Added pathToFileURL for safer path formatting
import Sequelize from 'sequelize';
import process from 'process';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';

const requireJson = createRequire(import.meta.url);
const config = requireJson(path.join(__dirname, '../config/config.json'))[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
});

// Load models sequentially
for (const file of files) {
  const filePath = path.join(__dirname, file);
  // FIX: Using pathToFileURL handles backslashes and special characters across Windows & Linux perfectly
  const fileUrl = pathToFileURL(filePath).href;

  const modelModule = await import(fileUrl);
  const modelDef = modelModule.default || modelModule;

  if (typeof modelDef === 'function') {
    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

// Setup associations once all models are loaded
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the populated object
export default db;