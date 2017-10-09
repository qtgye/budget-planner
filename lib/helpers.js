module.exports = {


  promise(fn) {
    return new Promise(fn);
  },

  log: console.log.bind(console),


};
