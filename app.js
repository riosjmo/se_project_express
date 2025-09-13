const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const helmet = require("helmet");
const escape = require("escape-html");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

app.use(cors());

app.use(helmet());

const { INTERNAL_SERVER_ERROR_CODE } = require("./utils/errors");

process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());

app.use(routes);

app.post("/comment", (req, res) => {
  const safeComment = escape(req.body.comment);
  res.send({ comment: safeComment });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(INTERNAL_SERVER_ERROR_CODE)
    .send({ message: "An error has occurred on the server." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
