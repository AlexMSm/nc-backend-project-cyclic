const { ident } = require("pg-format");
const db = require("../db/connection");
const { selectTopics } = require("./topics.models");

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

exports.selectArticlesByTopic = async (topic) => {
  const topics = await selectTopics();
  const okTopics = topics.map((topic) => {
    return topic.slug;
  });
  if (topic && !okTopics.includes(topic)) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: `${topic} is not a valid topic - available topics: ${okTopics}`,
    });
  }
  let query = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;
  if (topic) {
    query += ` WHERE articles.topic = '${topic}'`;
  }
  query += " GROUP BY articles.article_id ORDER BY created_at DESC;";

  return db.query(query).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({
        error: true,
        status: 404,
        msg: `No articles found on this topic.`,
      });
    } else {
      response.rows.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      return response.rows;
    }
  });
};

exports.selectCommentsByArticleId = async (article_id) => {
  const article = await this.selectArticleById(article_id);
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
