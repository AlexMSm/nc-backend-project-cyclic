const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("in model");
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};
