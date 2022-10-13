const { ident } = require("pg-format");
const db = require("../db/connection");
const { selectArticleById } = require("./articles.models");
const { createRef } = require("../db/seeds/utils");

exports.selectCommentsByArticleId = async (article_id) => {
  const article = await selectArticleById(article_id);
  if (article.error) {
    return article;
  } else {
    return db
      .query(
        `SELECT comments.* FROM comments
      LEFT JOIN articles ON articles.article_id = comments.article_id WHERE comments.article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      )
      .then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            error: true,
            status: 404,
            msg: `No comments found.`,
          });
        } else {
          return response.rows;
        }
      });
  }
};

exports.addCommentToArticle = async (article_id, comment) => {
  const article = await selectArticleById(article_id);
  if (article.error) {
    return article;
  } else {
    if (
      Object.keys(comment).includes("username") &&
      Object.keys(comment).includes("body") &&
      typeof comment.username === "string" &&
      typeof comment.body === "string"
    ) {
      return db
        .query(
          "INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING *;",
          [article_id, comment.body, comment.username]
        )
        .then((response) => {
          return response.rows[0];
        });
    } else {
      return Promise.reject({
        error: true,
        status: 400,
        msg: "Bad request - please use format '{username: <string>, body: <string>}'",
      });
    }
  }
};
