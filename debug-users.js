const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

console.log("Connecting to:", MONGO_URL);

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    return User.find({});
  })
  .then((users) => {
    console.log("Users in database:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Name: ${user.name}`);
    });
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });