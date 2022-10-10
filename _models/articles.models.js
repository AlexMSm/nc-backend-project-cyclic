const { ident } = require("pg-format");
const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  if (!(articleId > 0)) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request - Invalid article ID",
    });
  } else {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
      .then((article) => {
        if (!article.rows[0]) {
          return Promise.reject({
            error: true,
            status: 404,
            msg: "Article not found.",
          });
        } else {
          return article.rows[0];
        }
      })
      .catch((err) => {
        return err;
      });
  }
};

exports.updateVoteById = (article_id, body) => {
  console.log(body);
  if (Object.keys(body).includes("inc_votes")) {
    return this.selectArticleById(article_id).then((article) => {
      if (article.votes + body.inc_votes < 0) {
        console.log("Large vote");
        return Promise.reject({
          error: true,
          status: 400,
          msg: `Not possible to reduce votes below 0 - current vote is ${article.votes}`,
        });
      } else {
        return db
          .query(
            "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
            [body.inc_votes, article_id]
          )
          .then((response) => {
            return response.rows[0];
          });
      }
    });
  } else {
    console.log("Bad");
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request received please use format '{inc_vote : <integer>}'",
    });
  }
};
