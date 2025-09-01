const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

const app = express();
const { PORT = 3001 } = process.env;

const { MONGO_URL = "mongodb://127.0.0.1:3001/wtwr_db" } = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    // eslint-disable-next-line no-console
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


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
