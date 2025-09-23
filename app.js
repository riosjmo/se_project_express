
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

// Example safe comment route
app.post("/comment", (req, res) => {
  const safeComment = escape(req.body.comment);
  res.send({ comment: safeComment });
});

// Winston error logger (must come after routes)
app.use(errorLogger);

// Celebrate validation errors handler (must come after routes)
app.use(errors());

// Central error handler
app.use(errorHandler);

// Fallback error handler (just in case)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(INTERNAL_SERVER_ERROR_CODE)
    .send({ message: "An error has occurred on the server." });
});

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
