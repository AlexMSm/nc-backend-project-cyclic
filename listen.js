const { PORT = 9090 } = process.env;
const app = require("./app");

const express = require("express");

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
  }
);
