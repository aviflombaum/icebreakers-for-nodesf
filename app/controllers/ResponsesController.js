'use strict';

const ResponsesController = {};
const Question = require('../models/Question');
const IceBreaker = require('../models/IceBreaker');
const IceBreakerResponse = require('../models/IceBreakerResponse');

ResponsesController.Edit = async function (req, res, next) {
  const iceBreakerResponse = await IceBreakerResponse.FindBy("secret", req.query.secret);
  const iceBreaker = await IceBreaker.Find(iceBreakerResponse.iceBreakerID);
  const question = await Question.Find(iceBreaker.questionID);

  res.render('responses/edit', {
    question: question,
    iceBreakerResponse: iceBreakerResponse
  });
};

ResponsesController.Update = async function (req, res, next) {
  const iceBreakerResponse = await IceBreakerResponse.FindBy("secret", req.query.secret);
  const iceBreaker = await IceBreaker.Find(iceBreakerResponse.iceBreakerID);
  const question = await Question.Find(iceBreaker.questionID);

  await iceBreakerResponse.updateResponseText(req.body.responseText);

  res.redirect(`/responses?secret=${ iceBreaker.secret }`);
};

ResponsesController.Show = async function (req, res, next) {
  const iceBreaker = await IceBreaker.FindBy("secret", req.query.secret);
  const iceBreakerResponses = await IceBreakerResponse.FindAllByIceBreakerID(iceBreaker.id);
  const question = await Question.Find(iceBreaker.questionID);

  res.render('responses/show', {
    iceBreaker: iceBreaker,
    question: question,
    iceBreakerResponses: iceBreakerResponses
  });
};

module.exports = ResponsesController;
