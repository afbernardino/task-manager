const mongoose = require("mongoose");

const connectToDatabase = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
};

module.exports = connectToDatabase;
