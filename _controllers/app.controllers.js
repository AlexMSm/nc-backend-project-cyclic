const { selectArticleById } = require("../_models/app.models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      console.log(article);
      if (!article) {
        res.status(404).send({ msg: "Article not found." });
      } else {
        res.status(200).send(article);
      }
    })
    .catch((err) => {
      next(err);
    });
};
