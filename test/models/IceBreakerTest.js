'use strict';

process.env.NODE_ENV = 'test';

const { expect } = require('chai');

const db = require('../../config/db');
const Model = require('../../lib/Model');

const IceBreaker = require('../../app/models/IceBreaker');
Model.create(IceBreaker)

const createTable = () => new Promise((resolve, reject) => db.get('CREATE TABLE IF NOT EXISTS icebreakers ( id INTEGER PRIMARY KEY, questionID INTEGER, secret TEXT )', [], (err, row) => err ? reject(err) : resolve(row)));

const getTables = () => new Promise((resolve, reject) => {
  db.all("SELECT name FROM sqlite_master WHERE type = 'table'", [], (err, rows) => {
    err ? reject(err) : resolve(rows);
  });
});

const getTableInfo = tableName => new Promise((resolve, reject) => {
  db.get("SELECT * FROM sqlite_master WHERE type = 'table' AND name = ?", [ tableName ], (err, row) => {
    err ? reject(err) : resolve(row);
  });
});

const createDummyIceBreaker = (questionID, secret) => new Promise((resolve, reject) => db.get("INSERT INTO icebreakers (questionID, secret) VALUES (?, ?)", [ questionID, secret ], (err, row) => err ? reject(err) : resolve(row)));

const seedDB = () => Promise.all([
  createDummyIceBreaker(1234, 'abcd'),
  createDummyIceBreaker(4321, 'dcba'),
  createDummyIceBreaker(9876, 'zyxw')
]);

const resetDB = async () => {
  const tables = await getTables();

  tables.forEach(async t => await db.run(`DROP TABLE IF EXISTS ${ t.name }`));
};

describe('IceBreaker', () => {
  describe('as a class', () => {
    describe('.CreateTable()', () => {
      afterEach(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreaker.CreateTable).to.be.a('function');
      });

      it("creates a new table in the database named 'icebreakers'", async () => {
        await IceBreaker.CreateTable();

        const tables = await getTables();

        expect(tables[0].name).to.eq('icebreakers');
      });

      it("adds 'id', 'questionID', and 'secret' columns to the 'icebreakers' table", async () => {
        await IceBreaker.CreateTable();

        const { sql } = await getTableInfo('icebreakers');

        const idFieldExists = sql.indexOf('id INTEGER PRIMARY KEY') > -1;
        const questionIDFieldExists = sql.indexOf('questionID INTEGER') > -1;
        const secretFieldExists = sql.indexOf('secret TEXT') > -1;

        expect(idFieldExists, "'icebreakers' table is missing an 'id' field with type 'INTEGER' and modifier 'PRIMARY KEY'").to.eq(true);
        expect(questionIDFieldExists, "'icebreakers' table is missing a 'questionID' field with type 'INTEGER'").to.eq(true);
        expect(secretFieldExists, "'icebreakers' table is missing a 'secret' field with type 'TEXT'").to.eq(true);
      });
    });

    describe('.FindBy()', () => {
      before(async () => {
        await createTable();
        await seedDB();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreaker.FindBy).to.be.a('function');
      });

      it('finds an IceBreaker in the database by its secret and returns a new IceBreaker object', async () => {
        const foundIceBreaker = await IceBreaker.FindBy("secret", 'zyxw');

        expect(foundIceBreaker.questionID).to.eq(9876);
      });
    });

    describe('.Find()', () => {
      before(async () => {
        await createTable();
        await seedDB();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreaker.Find).to.be.a('function');
      });

      it('finds an IceBreaker in the database by its ID and returns a new IceBreaker object', async () => {
        const foundIceBreaker = await IceBreaker.Find(2);

        expect(foundIceBreaker.secret).to.eq('dcba');
      });
    });
  });

  describe('as an object', () => {
    it("sets the 'questionID' attribute when initializing a new object", () => {
      const iceBreaker = new IceBreaker(1234);

      expect(iceBreaker.questionID).to.eq(1234);
    });

    describe('#save()', () => {
      before(async () => {
        await createTable();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        const iceBreaker = new IceBreaker(6789);

        expect(iceBreaker.save).to.be.a('function');
      });

      it("persists itself to the 'icebreakers' database", async () => {
        const iceBreaker = new IceBreaker(6789);

        const savedIceBreaker = await iceBreaker.save();

        expect(savedIceBreaker.questionID).to.eq(6789);
      });
    });
  });
});
