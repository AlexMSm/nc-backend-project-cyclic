const {
  selectArticleById,
  updateVoteById,
} = require("../_models/articles.models");

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

exports.patchVoteById = (req, res, next) => {
  const articleId = req.params.article_id;
  const { body } = req;
  updateVoteById(articleId, body)
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
