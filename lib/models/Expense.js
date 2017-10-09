const Model = require('../Model');

const TABLE_NAME = 'expenses';


/**
 * --------------------------------------------------------------------------------------------
 * EXPENSE MODEL
 * --------------------------------------------------------------------------------------------
 */
module.exports = class Expense extends Model {

  constructor(props) {
    super(props);
  }

  static get table() { return TABLE_NAME; }

}