const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const err = new Error("User with this email already exists");
        err.statusCode = CONFLICT_ERROR_CODE;
        throw err;
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }));
    })
    .then((user) => {
      if (!user) return res.end();

      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send({
        name: userObj.name,
        avatar: userObj.avatar,
        email: userObj.email,
        message: "User created successfully",
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  return User.findById(_id)
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (
        err.statusCode === NOT_FOUND_ERROR_CODE ||
        err.name === "DocumentNotFoundError"
      ) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: "Incorrect email or password" });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND_ERROR_CODE;
      throw err;
    })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      console.error(err);

      if (
        err.statusCode === NOT_FOUND_ERROR_CODE ||
        err.name === "DocumentNotFoundError"
      ) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User not found" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data for update" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
