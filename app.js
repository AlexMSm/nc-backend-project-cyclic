const express = require("express");
const app = express();
app.use(express.json());

app.listen(9090, () => {
  console.log("Listening on port 9090");
});

module.exports = app;
