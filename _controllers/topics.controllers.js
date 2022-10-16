const { selectTopics, addTopic } = require("../_models/topics.models");

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const {body} = req;
  addTopic(body).then((topic) => {
    if (topic.error) {
      next(topic);
    } else {
    res.status(201).send(topic);
  }})
  .catch((err) => {
    next(err);
  });
}
