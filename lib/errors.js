module.exports = {


  NO_DB: new Error('No database connection.'.red),


  MODEL_INVALID_SCHEMA: new Error('There is no schema found for the given table. Please make sure that the schema file exists and has valid schema definition!'.red),
  MODEL_INVALID_PROPS: new Error('Invalid entity props. Please provide an object containing valid properties for the entity!'.red),
  MODEL_NOT_IN_DATABASE: new Error('Cannot remove a non-existing database entry!'.red),


  INVLID_TABLE_SCHEMA_NAME: new Error('Schema name must be a string.'.red),
  INVALID_TABLE_SQL: new Error(`Invalid SQL. Accepted format: "CREATE TABLE <name> (...columns)"`.red),
  INVALID_TABLE_DEFINITION: new Error(`Invalid table definition. Should contain a table name and list of columns.`.red),


  NO_STATIC_CLASS_INSTANCE: new Error('A static class cannot be instantiated. Use static properties and methods instead!'.red),
  NO_ABSTRACT_CLASS_INSTANCE: new Error('An abstract class should not be intantiated. Please extend it with another class instead!'.red),


}