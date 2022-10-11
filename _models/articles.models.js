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
      .query(
        `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
        [articleId]
      )
      .then((article) => {
        if (!article.rows[0]) {
          return Promise.reject({
            error: true,
            status: 404,
            msg: "Article not found.",
          });
        } else {
          article.rows[0].comment_count = Number(article.rows[0].comment_count);
          return article.rows[0];
        }
      })
      .catch((err) => {
        return err;
      });
  }
};

exports.updateVoteById = (article_id, body) => {
  if (
    Object.keys(body).includes("inc_votes") &&
    Number.isInteger(body.inc_votes)
  ) {
    return this.selectArticleById(article_id).then((article) => {
      if (article.error) {
        return article;
      } else if (article.votes + body.inc_votes < 0) {
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
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request received please use format '{inc_vote : <integer>}'",
    });
  }
};
