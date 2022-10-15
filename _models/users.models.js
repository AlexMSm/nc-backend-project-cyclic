const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

exports.selectUserByUsername = async (username) => {

  if (!/[a-zA-Z]/.test(username)) {
    return Promise.reject({
      error: true,
      status: 400,
      msg: "Bad request - Invalid username - must contain a letter",
    })
  } else {
    return db.query('SELECT * FROM users WHERE username = $1;', [username]).then((user) => {
      if (!user.rows[0]) {
        return Promise.reject({
          error: true,
          status: 404,
          msg: "User not found.",
        });
      } else {
        return user.rows[0];
      }
    })
    .catch((err) => {
      return err;
    })}
  }

