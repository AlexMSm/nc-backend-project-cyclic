const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.addTopic = (topic) => {
  if (
    Object.keys(topic).includes("slug") &&
    Object.keys(topic).includes("description") &&
    typeof topic.slug === "string" &&
    typeof topic.description === "string" &&
    Object.keys(topic).length === 2
  ) {
    return db
      .query(
        "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
        [topic.slug, topic.description]
      )
      .then((response) => {
        return response.rows[0];
      });
  } else {
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request - please use format {slug: <string>, description: <string>}",
    });
  }


}