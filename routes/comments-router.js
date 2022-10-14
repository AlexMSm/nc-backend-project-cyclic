const {
    getCommentsByArticleId,
    postCommentToArticle,
    deleteCommentById,
  } = require("../_controllers/comments.controllers");

const commentsRouter = require('express').Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;

