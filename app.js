const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const escape = require("escape-html");
const rateLimit = require("express-rate-limit");
const { celebrate, Joi, errors } = require("celebrate");

const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { createUser } = require("./controllers/users");
const { INTERNAL_SERVER_ERROR_CODE } = require("./utils/errors");

const app = express();
const PORT = process.env.PORT || 3001;
const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

// Security + general middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// MongoDB connection
mongoose.connect(MONGO_URL);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// Winston request logger
app.use(requestLogger);

// Routes
app.use(routes);

// Safe comment route
app.post("/comment", (req, res) => {
  const safeComment = escape(req.body.comment);
  res.send({ comment: safeComment });
});

// Example route with validation
app.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  createUser
);

// Winston error logger (must come after routes)
app.use(errorLogger);

// Celebrate validation errors handler
app.use(errors());

// Central error handler
app.use(errorHandler);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(INTERNAL_SERVER_ERROR_CODE)
    .send({ message: "An error has occurred on the server." });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
