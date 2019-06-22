const mongoose = require("mongoose");

const connectToDatabase = () => {
  const mongodbURL = process.env.MONGODB_URL
    ? process.env.MONGODB_URL
    : "mongodb://127.0.0.1:27017/task-manager";

  mongoose.connect(mongodbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
};

module.exports = connectToDatabase;
