'use strict';

const crypto = require('crypto');

class IceBreakerResponse {
  static Fields = {
    iceBreakerID: "INTEGER",
    email: "TEXT",
    secret: "TEXT",
    responseText: "TEXT",
    responseUrl: "TEXT" 
  }

  static BatchCreate(iceBreakerID, emails) {
    return new Promise((resolve, reject) => {
      const responses = emails.map(email => {
        const secret = crypto.randomBytes(10).toString('hex');
        const response = new IceBreakerResponse(iceBreakerID, email, secret);

        response.insert();

        return response;
      });

      resolve(responses);
    });
  }  

  constructor(iceBreakerID, email, secret) {
    this.iceBreakerID = iceBreakerID;
    this.email = email;
    this.secret = secret;
  }
}

module.exports = IceBreakerResponse;
