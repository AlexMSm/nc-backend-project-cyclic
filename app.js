const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./_controllers/topics.controllers");
const {
  getArticleById,
  patchVoteById,
} = require("./_controllers/articles.controllers");

const { getUsers } = require("./_controllers/users.controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchVoteById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

app.listen(9090, () => {
  console.log("Listening on port 9090");
});

module.exports = app;
