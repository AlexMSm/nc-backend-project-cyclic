const { selectUsers } = require("../_models/users.controllers");

exports.getUsers = (req, res) => {
  selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};
