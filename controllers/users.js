const User = require("../models/user");
const { NOT_FOUND_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_ERROR_CODE } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server.' });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user data" });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server.' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const err = new Error('User not found');
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === NOT_FOUND_ERROR_CODE || err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports = { getUsers, createUser, getUser };
