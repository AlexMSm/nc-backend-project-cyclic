const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./_controllers/topics.controllers");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err, "in the err500");
  res.status(500).send({ msg: "Internal Server Error" });
});

app.listen(9090, () => {
  console.log("Listening on port 9090");
});

module.exports = app;
