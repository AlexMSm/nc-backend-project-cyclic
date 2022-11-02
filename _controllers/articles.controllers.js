const {
  selectArticleById,
  updateVoteById,
  selectArticles,
  addArticle,
  removeArticle,
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

exports.getArticles = (req, res, next) => {
  const { query } = req;

  selectArticles(query)
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

exports.postArticle = (req, res, next) => {
  const { body } = req;

  addArticle(body)
    .then((article) => {
      if (article.error) {
        next(articles);
      } else {
        res.status(201).send(article);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const article_id = req.params.article_id;

  removeArticle(article_id)
    .then((response) => {
      if (response.error) {
        next(response);
      } else {
        res.status(204).send({});
      }
    })
    .catch((err) => {
      next(err);
    });
};
