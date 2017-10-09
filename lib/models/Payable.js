const Model = require('../Model');

const TABLE_NAME = 'payables';


/**
 * --------------------------------------------------------------------------------------------
 * EXPENSE MODEL
 * --------------------------------------------------------------------------------------------
 */
module.exports = class Payable extends Model {

  constructor(props) {
    super(props);
  }

  static get table() { return TABLE_NAME; }

}