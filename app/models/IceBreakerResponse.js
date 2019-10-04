'use strict';

const db = require("../../config/db");
const crypto = require('crypto');

class IceBreakerResponse {
  static Fields = {
    iceBreakerID: "INTEGER",
    email: "TEXT",
    secret: "TEXT",
    responseText: "text",
    responseUrl: "TEXT" 
  }


  static BatchCreate(iceBreakerID, emails) {
    return new Promise((resolve, reject) => {
      const responses = emails.map(email => {
        const secret = crypto.randomBytes(10).toString('hex');
        const response = new IceBreakerResponse(iceBreakerID, email, secret);

        response.save();

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

  static FindAllByIceBreakerID(iceBreakerID) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *
        FROM icebreakerresponses
        WHERE iceBreakerID = ?
      `;

      db.all(sql, [ iceBreakerID ], (err, rows) => {
        const results = rows.map(row => {
          const response = new IceBreakerResponse(row.icebreakerID, row.email, row.secret);
          response.id = row.id;
          response.responseText = row.responseText;
          return response;
        });

        resolve(results);
      });
    });
  }

  updateResponseText(responseText) {
    this.responseText = responseText;

    db.run(`
      UPDATE icebreakerresponses
      SET responseText = ?
      WHERE id = ?
    `, [
      this.responseText,
      this.id
    ]);
  }
}

module.exports = IceBreakerResponse;
