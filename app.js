const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const PORT = process.env.PORT || 3001;
const { MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

app.get("/crash-test", (req, res) => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
  res.send({ message: "Server will crash in 0ms!" });
});

// Handle preflight requests for all routes
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Security + general middlewares
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://riowtwr.jumpingcrab.com",
    "https://www.riowtwr.jumpingcrab.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
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

// Winston error logger (must come after routes)
app.use(errorLogger);

// Celebrate validation errors handler
app.use(errors());

// Central error handler
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
