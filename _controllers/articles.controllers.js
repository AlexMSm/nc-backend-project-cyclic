const {
  selectArticleById,
  updateVoteById,
  selectArticlesByTopic,
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

exports.getArticlesByTopic = (req, res, next) => {
  const { query } = req;
  selectArticlesByTopic(query)
    .then((articles) => {
      if (articles.error) {
        next(articles);
      } else {
        //console.log(articles);
        res.status(200).send(articles);
      }
    })
    .catch((err) => {
      next(err);
    });
};
