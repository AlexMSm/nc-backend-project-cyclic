const { getTopics, postTopic } = require("../_controllers/topics.controllers");
const topicsRouter = require('express').Router();

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;