const { selectArticleById, selectUsers } = require("../_models/app.models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      if (article.error) {
        next(article);
      } else {
        res.status(200).send(article);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};
