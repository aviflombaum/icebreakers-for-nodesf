// 'use strict';

// const { expect } = require('chai');

// const db = require('../../config/db');
// const Model = require('../../lib/Model');

// const Question = require('../../app/models/Question');
// Model.create(Question)

// function getTableInfo(tableName){
//   return new Promise(function(resolve){
//     const sql = `SELECT * FROM sqlite_master WHERE type = 'table' AND name = ?`
//     db.get(sql, [ tableName ], function(err, row){
//       resolve(row);
//     });
//   })
// };

// async function resetDB(){
//   return new Promise(async function(resolve){
//     await db.run(`DROP TABLE IF EXISTS questions`, function(){
//       resolve("dropped the questions table")
//     })
//   })
// };

// describe('Question', () => {
//   beforeEach(async function() {
//     await resetDB()

//     await Question.CreateTable()
//   })

//   afterEach(async function() {
//     await resetDB()
//   })

  
//   describe('.CreateTable()', () => {

//     it('is a static class function', async () => {
//       expect(Question.CreateTable).to.be.a('function');
//     });

//     it("returns a promise", async function(){
//       const CreateTablePromise = Question.CreateTable()

//       expect(CreateTablePromise).to.be.an.instanceOf(Promise);
//     })

//     it("creates a new table in the database named 'questions'", async () => {
//       await Question.CreateTable();

//       const table = await getTableInfo('questions')

//       expect(table.name).to.eq('questions');
//     });

//     it("adds 'id' and 'content' columns to the 'questions' table", async () => {
//       await Question.CreateTable();

//       const { sql } = await getTableInfo('questions');

//       const idFieldExists = sql.indexOf('id INTEGER PRIMARY KEY') > -1;
//       const contentFieldExists = sql.indexOf('content TEXT') > -1;

//       expect(idFieldExists, "'questions' table is missing an 'id' field with type 'INTEGER' and modifier 'PRIMARY KEY'").to.eq(true);
//       expect(contentFieldExists, "'questions' table is missing a 'content' field with type 'TEXT'").to.eq(true);
//     });
//   });

//   describe('insert()', function(){
//     it('is a function',  function(){
//       const question = new Question("Where in the world is Carmen Sandiego?")
//       expect(question.insert).to.be.a('function');
//     });

//     it("returns a promise", function(){
//       const question = new Question("Where in the world is Carmen Sandiego?")
//       const questionInsertPromise = question.insert()

//       expect(questionInsertPromise).to.be.an.instanceOf(Promise);
//     })

//     it("inserts the row into the database", function(done){
//       const question = new Question("Where in the world is Carmen Sandiego?")
//       question.insert()

//       db.get("SELECT * FROM questions WHERE content = 'Where in the world is Carmen Sandiego?'", function(err, result){
//         try{
//           expect(result.content).to.not.be.undefined
//           expect(result.content).to.eql("Where in the world is Carmen Sandiego?");
//           done()
//         } catch(err){
//           expect.fail(err, undefined, err.message)
//         }
//       })
//     })

//     it("sets the id of the instance based on the primary key", function(done){
//       const question = new Question("Where in the world is Carmen Sandiego?")
//       question.insert()

//       db.get("SELECT * FROM questions WHERE content = 'Where in the world is Carmen Sandiego?'", function(err, result){
//         try{
//           expect(result.id).to.not.be.undefined
//           expect(question.id).to.not.be.undefined
//           expect(question.id).to.eql(result.id)
//           done()
//         } catch(err){
//           expect.fail(err, undefined, err.message)
//         }
//       })
//     })

//     it("returns the instance as the resolution of the promise", async function(){
//       const question = new Question("Where in the world is Carmen Sandiego?")
//       const returnedQuestion = await question.insert()

//       expect(returnedQuestion).to.eql(question)
//     })
//   })

//   describe('.Find()', () => {
//     it('is a static class function', async () => {
//       expect(Question.Find).to.be.a('function');
//     });

//     it("returns a promise", async function(){
//       const question = new Question("Where in the World is Carmen Sandiego?")
//       await question.insert()

//       const FindPromise = Question.Find(1)

//       expect(FindPromise).to.be.an.instanceOf(Promise);
//     })

//     it('finds a Question in the database by its ID and returns a Question object', async function(){
//       const question = new Question("Where in the World is Carmen Sandiego?")
//       await question.insert()

//       const foundQuestion = await Question.Find(1);

//       expect(foundQuestion).to.be.an.instanceOf(Question)
//     });
    
//     it('returns a Question object with the correct properties from the DB', async function(){
//       const question = new Question("Where in the World is Carmen Sandiego?")
//       await question.insert()

//       const foundQuestion = await Question.Find(1);

//       expect(foundQuestion.id).to.eql(1)
//       expect(foundQuestion.content).to.eql("Where in the World is Carmen Sandiego?")
//       expect(foundQuestion).to.eql(question)
//     });
//   });
// });
