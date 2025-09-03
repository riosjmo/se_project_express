const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;
const { INTERNAL_SERVER_ERROR_CODE } = require("./utils/errors");

process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
  // Optionally, notify or log the error, but don't exit the process
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, notify or log the error
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "68b4dc7f1fea408baada6212",
  };
  next();
});

app.use(routes);

// Error-handling middleware (must be after routes)
app.use((err, req, res) => {
  console.error(err.stack);
  res
    .status(INTERNAL_SERVER_ERROR_CODE)
    .send({ message: "An error has occurred on the server." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
