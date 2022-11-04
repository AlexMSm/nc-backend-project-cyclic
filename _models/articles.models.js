const { ident } = require("pg-format");
const db = require("../db/connection");
const { selectTopics } = require("./topics.models");
const { selectUsers } = require("./users.models");

exports.selectArticleById = (articleId) => {
  if (!(articleId > 0) || !Number.isInteger(Number(articleId))) {
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
    Object.keys(body).includes("inc_vote") &&
    Number.isInteger(body.inc_vote)
  ) {
    return this.selectArticleById(article_id).then((article) => {
      if (article.error) {
        return article;
      } else {
        return db
          .query(
            "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
            [body.inc_vote, article_id]
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
      msg: "Bad request - please use format '{inc_vote : <integer>}'",
    });
  }
};

exports.selectArticles = async (req) => {
  const okQueries = ["sort_by", "order", "topic", "limit", "p"];
  const queries = Object.keys(req);

  for (let key of queries) {
    if (!okQueries.includes(key)) {
      return Promise.reject({
        error: true,
        status: 400,
        msg: `Bad request - ${key} is not a valid query.`,
      });
    }
  }

  const limit = false;

  if (Object.keys(queries).includes("limit")) {
    if (!(query.limit > 0) || !Number.isInteger(Number(query.limit))) {
      return Promise.reject({
        error: true,
        status: 400,
        msg: "Bad request - Invalid limit value.",
      });
    } else {
      limit = true;
    }
  }

  const okSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comments",
  ];
  if (req.sort_by && !okSorts.includes(req.sort_by)) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: `Bad request - invalid sort_by catergory.`,
    });
  }
  const okOrders = ["ASC", "DESC"];
  if (req.order && !okOrders.includes(req.order.toUpperCase())) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: `Bad request - invalid order catergory.`,
    });
  }

  const topics = await selectTopics();

  const okTopics = topics.map((topic) => {
    return topic.slug;
  });

  if (req.topic && !okTopics.includes(req.topic)) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: `${req.topic} is not a valid topic - available topics: ${okTopics}`,
    });
  }

  let query = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (req.topic) {
    query += ` WHERE articles.topic = '${req.topic}'`;
  }
  query += " GROUP BY articles.article_id";
  if (req.sort_by) {
    query += ` ORDER BY articles.${req.sort_by}`;
  } else {
    query += " ORDER BY created_at";
  }
  if (req.order) {
    query += ` ${req.order}`;
  } else {
    query += " DESC";
  }

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

exports.addArticle = async (req) => {
  if (
    Object.keys(req).includes("body") &&
    Object.keys(req).includes("title") &&
    Object.keys(req).includes("topic") &&
    Object.keys(req).includes("username") &&
    typeof req.body === "string" &&
    typeof req.title === "string" &&
    typeof req.topic === "string" &&
    typeof req.username === "string" &&
    Object.keys(req).length === 4
  ) {
    const topics = await selectTopics();
    const okTopics = topics.map((topic) => {
      return topic.slug;
    });
    if (!okTopics.includes(req.topic)) {
      return Promise.reject({
        error: true,
        status: 400,
        msg: `${req.topic} is not a valid topic - available topics: ${okTopics}`,
      });
    }

    const users = await selectUsers();
    const okUsers = users.map((user) => {
      return user.username;
    });

    if (!okUsers.includes(req.username)) {
      return Promise.reject({
        error: true,
        status: 400,
        msg: `${req.username} is not a valid user - available users: ${okUsers}`,
      });
    }

    return db
      .query(
        "INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;",
        [req.username, req.title, req.body, req.topic]
      )
      .then((response) => {
        return response.rows[0];
      });
  } else {
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request - please use format {username: <string>, title: <string>, body: <string>, topic:<string>}",
    });
  }
};

exports.removeArticle = async (article_id) => {
  if (!(article_id > 0) || !Number.isInteger(Number(article_id))) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request - Invalid article ID",
    });
  } else {
    return db
      .query(`DELETE FROM comments WHERE article_id = $1 RETURNING *;`, [
        article_id,
      ])
      .then((response) => {
        return db
          .query("DELETE FROM articles WHERE article_id = $1 RETURNING *;", [
            article_id,
          ])
          .then((response) => {
            if (response.rows.length === 0) {
              return Promise.reject({
                error: true,
                status: 404,
                msg: `Article not found.`,
              });
            } else {
              return response.rows;
            }
          });
      });
  }
};
