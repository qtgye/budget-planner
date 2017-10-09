module.exports = {

  /**
   * Tests whether a given string matches sqlite3 table's CREATE syntax
   * `CREATE TABLE <name> ( <prop type [primary key]>[, <prop type>...] )`
   * @type {RegExp}
   */
  SQL_CREATE_PATTERN : /^\s*CREATE\s+TABLE\s+([a-z0-9_\-]+)\s*[(]\s*((?:\s*[a-z]+(?:\s+[a-z0-9_-]+)+\s*)+(?:\s*[,]\s*[a-z0-9_-]+(?:\s+[a-z0-9\(\),\s]+)+\s*)*)\s*[)]\s*$/i,

  /**
   * Splits comma-delimited string of properties from a raw sql string
   * @type {RegExp}
   */
  SQL_PROPERTIES_SPLITTER_PATTERN : /(\s*(?:[a-z0-9_-]+)\s+(?:[a-z0-9]+)(?:\s[(][0-9\s]*,[0-9\s]*[)]\s*)*\s*(?:primary key)*\s*)/ig,

  /**
   * Matches a single column definition in an sql string
   * `(<propname>) (<proptype>) [(primary key)]`
   * @type {RegExp}
   */
  SQL_PROPERTY_DEFINER_PATTERN : /^\s*([a-z0-9_-]+)\s+((?:[a-z0-9]+)(?:\s*[(][0-9\s]*,[0-9\s]*[)]\s*)*)\s*(primary key)*\s*$/i,


}