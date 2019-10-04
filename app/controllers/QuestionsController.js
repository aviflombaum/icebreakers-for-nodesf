const QuestionsController = {}
const Question = require('../models/Question');
const IceBreaker = require('../models/IceBreaker');
const IceBreakerResponse = require('../models/IceBreakerResponse');

QuestionsController.Index = async function(req, res, next) {
  const questions = await Question.All()
  res.render('questions/index', {questions: questions});
}

QuestionsController.New = function(req, res, next) {
  
  res.render('questions/new', {});
}

QuestionsController.Create = async function(req, res, next) {
  question = new Question(req.body.questionContent);
  await question.save()  
  
  res.redirect('/');
}

module.exports = QuestionsController