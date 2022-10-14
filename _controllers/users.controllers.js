const { selectUsers, selectUserByUsername } = require("../_models/users.models");

exports.getUsers = (req, res) => {
  selectUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username
  selectUserByUsername(username).then((user)=>{
    if (user.error) {
      next(user);
    } else {
      res.status(200).send(user);
    }
  })
  .catch((err) => {
    next(err);
  });
}

