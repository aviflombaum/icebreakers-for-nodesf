const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const exitHook = require('exit-hook');

const app = express();

// view engine setups
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const Model = require('./lib/Model');

// Load Models
const Question = require('./app/models/Question');
const IceBreaker = require('./app/models/IceBreaker');
const IceBreakerResponse = require('./app/models/IceBreakerResponse');

Model.create(Question);
Model.create(IceBreaker);
Model.create(IceBreakerResponse);

// Run Migrations
(async function(){
  await Question.CreateTable()
  await IceBreaker.CreateTable()
  await IceBreakerResponse.CreateTable()
})();

// Mount Controllers
const QuestionsController = require('./app/controllers/QuestionsController');
const IceBreakersController = require('./app/controllers/IceBreakersController');
const ResponsesController = require('./app/controllers/ResponsesController');

// Routing Engine
app.get('/', QuestionsController.Index);
app.get('/questions/new', QuestionsController.New);
app.post('/questions', QuestionsController.Create);
app.get('/icebreakers/new', IceBreakersController.New);
app.post('/icebreakers', IceBreakersController.Create);
app.get('/icebreakers', IceBreakersController.Show);
app.get('/responses/edit', ResponsesController.Edit);
app.post('/responses', ResponsesController.Update);
app.get('/responses', ResponsesController.Show);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err, req, res)
  res.render('error');
});

// exitHook(function(){
//   app.db.close(function(err){
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
// });

// exitHook(function(){
//   console.log("Exiting application server, goodbye!")
// })
//

module.exports = app;

debugger;
