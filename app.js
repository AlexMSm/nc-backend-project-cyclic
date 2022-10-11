const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./_controllers/topics.controllers");
const {
  getArticleById,
  patchVoteById,
  getArticleCommentCount,
  getArticlesByTopic,
} = require("./_controllers/articles.controllers");

const { getUsers } = require("./_controllers/users.controllers");

app.get("/api/articles", getArticlesByTopic);

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
//app.get("/api/articles/:article_id", getArticleCommentCount);

app.patch("/api/articles/:article_id", patchVoteById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
