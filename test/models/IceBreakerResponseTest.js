'use strict';

process.env.NODE_ENV = 'test';

const { expect } = require('chai');

const db = require('../../config/db');
const Model = require('../../lib/Model');

const IceBreakerResponse = require('../../app/models/IceBreakerResponse');
Model.create(IceBreakerResponse)


const createTable = () => new Promise((resolve, reject) => db.get(`
  CREATE TABLE IF NOT EXISTS icebreakerresponses (
    id INTEGER PRIMARY KEY,
    iceBreakerID INTEGER,
    email TEXT,
    secret TEXT,
    responseText TEXT,
    responseUrl TEXT
  )
`, (err, row) => err ? reject(err) : resolve(row)));

const getTables = () => new Promise((resolve, reject) => db.all(`
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
`, (err, rows) => err ? reject(err) : resolve(rows)));

const getTableInfo = tableName => new Promise((resolve, reject) => db.get(`
  SELECT *
  FROM sqlite_master
  WHERE type = 'table'
  AND name = ?
`, [ tableName ], (err, row) => err ? reject(err) : resolve(row)));

const findResponseByID = id => new Promise((resolve, reject) => db.get(`
  SELECT *
  FROM icebreakerresponses
  WHERE id = ?
`, [ id ], (err, row) => {
  if (err) reject(err);

  const response = new IceBreakerResponse(row.iceBreakerID, row.email, row.secret);
  response.id = row.id;
  response.responseText = row.responseText;

  resolve(response);
}));

const createDummyResponses = (iceBreakerID, email, secret) => new Promise((resolve, reject) => db.get(`
  INSERT INTO icebreakerresponses (
    iceBreakerID,
    email,
    secret
  ) VALUES (?, ?, ?)
`, [ iceBreakerID, email, secret ], (err, row) => err ? reject(err) : resolve(row)));

const seedDB = () => Promise.all([
  createDummyResponses(1, 'avi@flatironschool.com', 'abcd'),
  createDummyResponses(2, 'joe@flatironschool.com', 'dcba'),
  createDummyResponses(2, 'gabe@flatironschool.com', 'zyxw')
]);

const resetDB = async () => {
  const tables = await getTables();

  tables.forEach(async t => await db.run(`DROP TABLE IF EXISTS ${ t.name }`));
};

describe('IceBreakerResponse', () => {
  describe('as a class', () => {
    describe('.CreateTable()', () => {
      afterEach(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreakerResponse.CreateTable).to.be.a('function');
      });

      it("creates a new table in the database named 'icebreakerresponses'", async () => {
        await IceBreakerResponse.CreateTable();

        const tables = await getTables();

        expect(tables[0].name).to.eq('icebreakerresponses');
      });

      it("adds 'id', 'iceBreakerID', 'email', 'secret', 'responseText', and 'responseUrl' columns to the 'icebreaker_responses' table", async () => {
        await IceBreakerResponse.CreateTable();

        const { sql } = await getTableInfo('icebreakerresponses');

        const idFieldExists = sql.indexOf('id INTEGER PRIMARY KEY') > -1;
        const icebreaker_idFieldExists = sql.indexOf('iceBreakerID INTEGER') > -1;
        const emailFieldExists = sql.indexOf('email TEXT') > -1;
        const secretFieldExists = sql.indexOf('secret TEXT') > -1;
        const response_textFieldExists = sql.indexOf('responseText TEXT') > -1;
        const response_urlFieldExists = sql.indexOf('responseUrl TEXT') > -1;

        expect(idFieldExists, "'icebreakerresponses' table is missing an 'id' field with type 'INTEGER' and modifier 'PRIMARY KEY'").to.eq(true);
        expect(icebreaker_idFieldExists, "'icebreakerresponses' table is missing a 'iceBreakerID' field with type 'INTEGER'").to.eq(true);
        expect(emailFieldExists, "'icebreakerresponses' table is missing a 'email' field with type 'TEXT'").to.eq(true);
        expect(secretFieldExists, "'icebreakerresponses' table is missing a 'secret' field with type 'TEXT'").to.eq(true);
        expect(response_textFieldExists, "'icebreakerresponses' table is missing a 'responseText' field with type 'TEXT'").to.eq(true);
        expect(response_urlFieldExists, "'icebreakerresponses' table is missing a 'responseUrl' field with type 'TEXT'").to.eq(true);
      });
    });

    // describe('.BatchCreate()', () => {
    //   beforeEach(async () => {
    //     await createTable();
    //   });

    //   afterEach(async () => {
    //     await resetDB();
    //   });

    //   it('exists', () => {
    //     expect(IceBreakerResponse.BatchCreate).to.be.a('function');
    //   });

    //   it('returns an array of IceBreakerResponse objects', async () => {
    //     const responses = await IceBreakerResponse.BatchCreate(4, [
    //       'avi@flatironschool.com',
    //       'joe@flatironschool.com',
    //       'gabe@flatironschool.com'
    //     ]);

    //     expect(responses[2].email).to.eq('gabe@flatironschool.com');
    //   });

    //   it('persists created IceBreakerResponse objects to the database', async () => {
    //     await IceBreakerResponse.BatchCreate(2, [
    //       'joe@flatironschool.com',
    //       'avi@flatironschool.com'
    //     ]);

    //     const response = await findResponseByID(2);

    //     expect(response.iceBreakerID).to.eq(2);
    //   });
    // });

    describe('.FindAllBy()', () => {
      before(async () => {
        await createTable();
        await seedDB();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreakerResponse.FindAllBy).to.be.a('function');
      });

      it('finds an IceBreakerResponse in the database by its secret and returns a new IceBreakerResponse object', async () => {
        const responses = await IceBreakerResponse.FindAllBy('iceBreakerID', 2);

        expect(responses[1].secret).to.eq('zyxw');
      });
    });

    describe('.FindBySecret()', () => {
      before(async () => {
        await createTable();
        await seedDB();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        expect(IceBreakerResponse.FindBy).to.be.a('function');
      });

      it('finds an IceBreakerResponse in the database by its secret and returns a new IceBreakerResponse object', async () => {
        const response = await IceBreakerResponse.FindBy('secret', 'zyxw');

        expect(response.iceBreakerID).to.eq(2);
      });
    });
  });

  describe('as an object', () => {
    it("sets the 'iceBreakerID', 'email', and 'secret' attributes when initializing a new object", () => {
      const response = new IceBreakerResponse(5, 'joe@flatironschool.com', 'xyz');

      expect(response.iceBreakerID).to.eq(5);
      expect(response.email).to.eq('joe@flatironschool.com');
      expect(response.secret).to.eq('xyz');
    });

    describe('#insert()', () => {
      before(async () => {
        await createTable();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        const response = new IceBreakerResponse(9, 'avi@flatironschool.com', 'zyxwv');

        expect(response.insert).to.be.a('function');
      });

      it("persists itself to the 'icebreakerresponses' database", async () => {
        const response = new IceBreakerResponse(9, 'avi@flatironschool.com', 'zyxwv');

        await response.insert();

        const persistedResponse = await findResponseByID(1);

        expect(persistedResponse.secret).to.eq('zyxwv');
      });
    });

    describe('#updateResponseText()', () => {
      before(async () => {
        await createTable();
        await seedDB();
      });

      after(async () => {
        await resetDB();
      });

      it('exists', () => {
        const response = new IceBreakerResponse(9, 'avi@flatironschool.com', 'zyxwv');

        expect(response.update).to.be.a('function');
      });

      it("updates the 'responseText' property of the object upon which it is invoked", async () => {
        const response = new IceBreakerResponse(9, 'avi@flatironschool.com', 'zyxwv');
        response.responseText = 'blah blah blah'
        await response.update();

        expect(response.responseText).to.eq('blah blah blah');
      });

      it("persists the updated 'responseText' property to the object's database record", async () => {
        const response = await findResponseByID(1);
        response.responseText = 'bleep bloop'
        await response.update();

        const updatedResponse = await findResponseByID(1);

        expect(updatedResponse.responseText).to.eq('bleep bloop');
      });
    });
  });
});
