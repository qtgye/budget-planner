require('colors');
const sqlite3_DB = require('better-sqlite3');

const { promise, log } = require('./lib/helpers');

initializeApp()
.then(log)
.catch(log);

/**
 * --------------------------------------------------------------------------------------------
 * HELPERS
 * --------------------------------------------------------------------------------------------
 */

function initializeApp () {
  return promise((resolve, reject) => {
    try {
      let App = require('./lib/App');
      App.init();
    } catch (err) {
      reject(err);
    }
  });
}