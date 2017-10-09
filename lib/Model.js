const DB = require('./Database');
const AbstractClass = require('./AbstractClass');
const Schema = require('./Schema');

const { MODEL_INVALID_SCHEMA,
        MODEL_INVALID_PROPS,
        MODEL_NOT_IN_DATABASE } = require('./errors');

/**
 * --------------------------------------------------------------------------------------------
 * MODEL CLASS
 *
 * This should handle all database entities (Like Eloquent of Laravel)
 * --------------------------------------------------------------------------------------------
 */

module.exports = class Model extends AbstractClass {


  constructor( props ) {
    super();

    // Access prototype
    let prototype = this.__proto__;
    // Access static methods
    let constructor = this.constructor;

    this.table = constructor.table;

    // Get schema
    this.schema = Schema.get(constructor.table);
    if ( !this.schema ) throw MODEL_INVALID_SCHEMA;

    let columnNames = this.schema.columns.map( prop => prop.name );
    // Populate
    for ( let propName in props ) {
      if ( !columnNames.includes(propName) ) continue;
      this[propName] = props[propName];
    }

    // Add id
    if ( 'id' in props ) this.__defineGetter__('id', () => props.id);
  }



  /**
   * Saves an entity
   * If the item is not yet in the DB, insert it
   * Else, just update it
   * @return {Object} this
   */
  save() {

    let query = '';
    let columnNames = [];
    let placeholder = [];
    let values = [];

    // Parse column names, values, and placeholders
    // Do not include `id` for this time
    for ( let column of this.schema.columns.slice(1) ) {
      if ( !this[column.name] ) continue;
      columnNames.push(column.name);
      values.push(this[column.name]);
      placeholder.push('?');
    }

    // INSERT QUERY
    if ( !this.id ) {
      query =  `INSERT INTO ${this.table}(${columnNames.join(',')}) VALUES(${placeholder.join(',')})`;
      let result = DB.prepare(query).run(values);
      if ( result && result.lastInsertROWID ) {
        this.__defineGetter__('id', () => result.lastInsertROWID );
      }
    }

    // UPDATE QUERY
    else {
      let keyValuePairs = columnNames.map( column => `${column} = ?` ).join(', ');
      query =  `UPDATE ${this.table} SET ${keyValuePairs}`;
      DB.prepare(query).run(values);
    }

    return this;
  }



  /**
   * Applies values of a given property map as new values for this entity
   * @param  {Object} props - map of new properties
   * @return {Object}       this
   */
  update( props = {} ) {

    if ( typeof props !== 'object' ) throw MODEL_INVALID_PROPS;

    let columnNames = this.schema.columns.map( column => column.name );

    for ( let propName in props ) {
      if ( !columnNames.includes(propName) ) continue;
      this[propName] = props[propName];
    }

    return this.save();

  }



  /**
   * Removes this entry from the Database,
   * if successful, only the id property is deleted from this entity,
   * indicating that this has no entry in the db
   * @return {Object} this
   */
  delete() {

    // If this entity has no ID, it is assumed that this has no entry in the database
    if ( !this.id ) throw MODEL_NOT_IN_DATABASE;

    // Delete
    let query = `DELETE FROM ${this.table} WHERE id=?`;
    DB.prepare(query).run(this.id);

    delete this.id;
    return this;
  }



  /**
   * --------------------------------------------------------------------------------------------
   * STATIC PROPERTIES AND METHODS
   * --------------------------------------------------------------------------------------------
   */



  static get(id) {
    let query = `SELECT * FROM ${this.table} WHERE id = ?`;
    let result = DB.prepare(query).get(id);

    if ( !result ) return null;

    return new this(result);
  }


  /**
   * Gets all entries
   * @return {Array} - List of results
   */
  static all() {
    let query = `SELECT * FROM ${this.table}`;
    let result = DB.prepare(query).all();

    if ( !result ) return null;

    return result.map( item => new this(item));
  }




}