const fs = require('fs-extra');
const path = require('path');
const walkSync = require('klaw-sync')

const StaticClass = require('./StaticClass');
const PROJECT_ROOT = process.cwd();
const { NO_DB,
        INVLID_TABLE_SCHEMA_NAME,
        INVALID_TABLE_SQL,
        INVALID_TABLE_DEFINITION } = require('./errors');
const { SQL_CREATE_PATTERN,
        SQL_PROPERTIES_SPLITTER_PATTERN,
        SQL_PROPERTY_DEFINER_PATTERN } = require('./patterns');
const SCHEMA_ROOT = path.resolve(PROJECT_ROOT, `schema`);
const TABLE_OBJECT_REQUIRED_PROPS = ['name', 'columns'];


/**
 * --------------------------------------------------------------------------------------------
 * SCHEMA CLASS
 * --------------------------------------------------------------------------------------------
 */

module.exports = class Schema extends StaticClass {

  constructor( ) {
    super();
  }


  /**
   * Gets a map of schema objects from schema files
   * @param  {String}     schemaNames - A single schema name
   *         {Array}      schemaNames - A list of multiple schema names
   *         {undefined}  schemaNames - If you wish to get all schema, just don't pass anything
   * @return {Object}
   */
  static get( schemaNames ) {

    let schemaLookup = [];

    schemaLookup = typeof schemaNames === 'string' ? [ schemaNames ] : // If single string
                   Array.isArray(schemaNames) && schemaNames.length > 0 ? schemaNames : // If array
                   'all'; // Else, look for all

    // Get paths for all
    if ( schemaLookup === 'all' ) {
      schemaLookup = walkSync(SCHEMA_ROOT, {nodir: true}).map( item => item.path );
    }
    // Get paths for given schema list
    else {
      let filteredPaths = [];
      for ( let name of schemaLookup ) {
        let schemaPath = path.resolve(SCHEMA_ROOT, `${name}.js`);
        if ( !fs.existsSync(schemaPath) ) continue;
        filteredPaths.push(schemaPath);
      }
      schemaLookup = filteredPaths;
    }

    if ( !schemaLookup.length ) return null;

    // Parse as tableDefinitions
    let schemaMap = {};
    for ( let schemaPath of schemaLookup ) {
      let name = schemaPath.match(/([^\/]+)[.]js$/i)[1];
      let schema = require(schemaPath);
      let columns = schema;
      // Prepend id
      columns.unshift({
        name: 'id',
        type: 'INTEGER',
        primaryKey: true,
      });
      schemaMap[name] = { name, columns };
    }

    if ( Object.keys(schemaMap).length === 1 ) return schemaMap[Object.keys(schemaMap)];
    return schemaMap;

  }



  // Converts sql to tableDefinition object
  static sqlToObject( sql = '' ) {

    if ( typeof sql !== 'string' ) throw INVALID_TABLE_SQL;

    let matches = sql.match(SQL_CREATE_PATTERN);
    if ( !matches ) throw INVALID_TABLE_SQL;

    let name = matches[1];
    // Split comma-delimited properties
    let columns = matches[2].match(SQL_PROPERTIES_SPLITTER_PATTERN).map( column => {
      // Break up column parts
      column = column.match(SQL_PROPERTY_DEFINER_PATTERN);
      return {
        name: column[1],
        type: column[2].toUpperCase(),
        primaryKey: column[3] ? true : false,
      };
    });

    return { name, columns };
  }



  // Converts object to sql
  static objectToSql( tableDefinition = {} ) {

    if ( typeof tableDefinition !== 'object' ) throw INVALID_TABLE_DEFINITION;

    let tableDefinitionKeys = Object.keys(tableDefinition);

    if ( !TABLE_OBJECT_REQUIRED_PROPS.every( key => tableDefinitionKeys.includes(key) ) ) throw INVALID_TABLE_DEFINITION;

    let columns = tableDefinition.columns.map( column => `${column.name} ${column.type}` + (column.primaryKey ? ' primary key': ''));

    return `CREATE TABLE ${tableDefinition.name} (${columns})`;
  }


}