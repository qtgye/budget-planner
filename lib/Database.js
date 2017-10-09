const _ = require('underscore');
const deepMerge = require('deepmerge');
const sqlite3_DB = require('better-sqlite3');

const { promise } = require('./helpers')
const { NO_DB, INVLID_TABLE_SCHEMA_NAME } = require('./errors');
const App = require('./App');

const defaultOptions = {
  databaseFile: `${process.cwd()}/data.db`,
};


class Database {

  constructor( _options ) {
    this.options = deepMerge(defaultOptions, _options);
    this.connection = new sqlite3_DB(this.options.databaseFile);
  }


  prepare(query = '') {
    return this.connection.prepare(query);
  }



  /**
   * --------------------------------------------------------------------------------------------
   * STATIC METHODS AND PROPERTIES
   * --------------------------------------------------------------------------------------------
   */


}


module.exports = new Database(App.config);