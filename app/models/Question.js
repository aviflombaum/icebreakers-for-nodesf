'use strict';

class Question {
  static Fields = {
    "content": "TEXT"
  }

  constructor(content) {
    this.content = content;
  }
}

module.exports = Question;
