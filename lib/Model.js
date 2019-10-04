'use strict';

const db = require("../config/db");

class Model{  
  static All = function() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *
        FROM ${this.tableName()}
      `;

      db.all(sql, [], (err, rows) => {
        const results = rows.map(row => {
          const obj = new this();
          for (var key in this.Fields) {
            obj[key] = row[key]
          }         
          obj.id = row.id;

          return obj;
        });

        resolve(results);
      });
    });
  }


  static questionMarksForInsert = function(){
    let str = "?,".repeat(Object.keys(this.Fields).length)
    return str.substring(0, str.length - 1)
  }

  static FindBy = function(column, value) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *
        FROM ${this.tableName()}
        WHERE ${column} = ?
      `;

      db.get(sql, [ value ], (err, row) => {
        const obj = new this();
        obj.id = row.id;
        for (var key in this.Fields) {
          obj[key] = row[key]
        }         
        resolve(obj);
      });
    });
  }

  static Find = function(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT *
        FROM ${this.tableName()}
        WHERE id = ?
      `;

      db.get(sql, [ id ], (err, row) => {
        const obj = new this();
        obj.id = row.id;
        for (var key in this.Fields) {
          obj[key] = row[key]
        }         
        resolve(obj);
      });
    });
  }


  static tableName = function(){
    return `${this.name.toLowerCase()}s`
  }

  static FieldsForInsert = function(){
    return Object.keys(this.Fields).join(",")
  }

  static FieldsForCreate = function(){
    let fieldArr = [];
    for (var key in this.Fields) {
      fieldArr.push(`${key} ${this.Fields[key]}`)
    }
    return fieldArr.join(", ")
  }

  static CreateTable = function(){
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName()} (
        id INTEGER PRIMARY KEY,
        ${this.FieldsForCreate()}
      )
    `;

    db.run(sql);
  }  

}

Model.InstanceFunctions = {
  save() {
    const obj = this;
    const insertSQL = `INSERT INTO ${this.constructor.tableName()} (${this.constructor.FieldsForInsert()}) VALUES (${this.constructor.questionMarksForInsert()})`
    const valuesForSQL = Object.keys(this.constructor.Fields).map(function(key){
      return obj[key]
    })

    return new Promise((resolve, reject) => {
      db.run(insertSQL, valuesForSQL)
        .get(`
          SELECT *
          FROM ${this.constructor.tableName()}
          WHERE id = last_insert_rowid()
        `, [], (err, row) => {
          if (err) reject(err);

          this.id = row.id;

          resolve(this);
        });
    });
  }
}

Model.create = function(model){
  Object.assign(model, Model)
  Object.assign(model.prototype, Model.InstanceFunctions)
}

module.exports = Model;