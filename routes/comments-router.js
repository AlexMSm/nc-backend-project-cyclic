const {
    deleteCommentById,
    patchCommentVote
  } = require("../_controllers/comments.controllers");

const commentsRouter = require('express').Router();

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchCommentVote)

module.exports = commentsRouter;
