const {
    getArticleById,
    patchVoteById,
    getArticles,
    postArticle,
    deleteArticle
  } = require("../_controllers/articles.controllers");

  const {
    getCommentsByArticleId,
    postCommentToArticle,
    
  } = require("../_controllers/comments.controllers");

const articlesRouter = require('express').Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchVoteById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/", postArticle);
articlesRouter.post("/:article_id/comments", postCommentToArticle);
articlesRouter.delete('/:article_id', deleteArticle)


module.exports = articlesRouter;