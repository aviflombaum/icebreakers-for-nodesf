'use strict';

const crypto = require('crypto');

class IceBreaker {
  static Fields = {
    "questionID": "INTEGER",
    "secret": "TEXT"
  }

  constructor(questionID) {
    this.questionID = questionID;
    this.secret = crypto.randomBytes(10).toString('hex');
  }  
}

module.exports = IceBreaker;
