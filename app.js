const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require('./routes/api-router');

app.use('/api', apiRouter);


app.all("/*", (req, res) => {
  res.status(404).send({ message: "Bad path" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Unknown Invalid Input" });
    } else {
      res.status(err.status).send({ msg: err.msg });
    }
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
