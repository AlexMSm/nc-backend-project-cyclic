const apiRouter = require('express').Router();
const usersRouter = require('./users-router');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');

apiRouter.use('/users', usersRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.get("/", (req, res) => {
    const endpoint = require("./endpoints.json");
    res.status(200).send({ endpoint });
  });

module.exports = apiRouter;