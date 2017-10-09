const path = require('path');

const APP_ROOT = path.resolve(__dirname, '..');
const MODELS_ROOT = path.resolve(__dirname, APP_ROOT);
const PROJECT_ROOT = process.cwd();
const CONFIG = require(path.resolve(PROJECT_ROOT, 'database.config.js'));

module.exports = {

  appRoot: APP_ROOT,
  projectRoot: PROJECT_ROOT,
  config: CONFIG,

  init: function () {
    const Table = require('./Table')
    Table.verifyAll();
  }

};






