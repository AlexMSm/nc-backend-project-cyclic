const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  if (!(articleId > 0)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - Invalid article ID",
    });
  } else {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
      .then((article) => {
        return article.rows[0];
      });
  }
};
