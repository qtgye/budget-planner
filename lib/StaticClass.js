let { NO_STATIC_CLASS_INSTANCE } = require('./errors');


/**
 * --------------------------------------------------------------------------------------------
 * STATIC CLASS
 *
 * Handles class that should not be instatiated
 * --------------------------------------------------------------------------------------------
 */

module.exports = class StaticClass {
  constructor( ) {
    throw NO_STATIC_CLASS_INSTANCE;
  }
}