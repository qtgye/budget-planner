const { NO_ABSTRACT_CLASS_INSTANCE } = require('./errors');

/**
 * --------------------------------------------------------------------------------------------
 * ABSTRACT CLASS
 *
 * An Abstract Class should not be instantiated. It can just be extended with another class.
 * --------------------------------------------------------------------------------------------
 */


module.exports = class AbstractClass {

  constructor() {
    if ( this.__proto__.__proto__.constructor === AbstractClass ) throw NO_ABSTRACT_CLASS_INSTANCE;
  }

}