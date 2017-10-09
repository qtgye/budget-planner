const deepMerge = require('deepmerge');
const fs = require('fs-extra');
const sqlite_DB = require('better-sqlite3');
const walkSync = require('klaw-sync');

const StaticClass = require('./StaticClass');
const DB = require('./Database');
const Schema = require('./Schema');
const { NO_DB,
        INVLID_TABLE_SCHEMA_NAME,
        INVALID_TABLE_SQL,
        INVALID_TABLE_DEFINITION } = require('./errors');




/**
 * --------------------------------------------------------------------------------------------
 * TABLE CLASS
 * --------------------------------------------------------------------------------------------
 */


module.exports = class Table extends StaticClass {

  constructor() {
    super();
  }


  get queries () {
    return {
      all: `select * from sqlite_master where type="table"`,
    }
  }



  /**
   * Cretes new table in the database, acc. to given schema
   * @param  {String|Object} sqlOrSchemaObject - {String} SQL, or {Object} Schema
   */
  static create(sqlOrSchemaObject) {
    // If given is an object, create an sql
    let sql = (typeof sqlOrSchemaObject !== 'string') ? Schema.objectToSql(sqlOrSchemaObject) : sqlOrSchemaObject;
    return DB.prepare(sql).run();
  }


  /**
   * Checks for existence of tables
   * If there is no table, then this must be a new DB.
   * Create tables acc. to schema
   */
  static verifyAll() {
    let tables = this.all();

    if ( !tables.length ) {
      let schema =  Schema.get();
      for ( let tableName in schema ) { this.create(schema[tableName]) };
    }

    return tables;
  }


  /**
   * Gets all tables
   * @return {Array} - List of tables
   */
  static all() {
    let sql = 'select sql from sqlite_master where type="table"';
    return DB.prepare(sql).all().map( table => Schema.sqlToObject(table.sql) );
  }


}