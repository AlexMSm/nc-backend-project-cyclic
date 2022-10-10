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
      .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
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
