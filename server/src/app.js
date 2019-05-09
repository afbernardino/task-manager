const connectToDatabase = require("./database/dbConnector");
const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// connect to the database
connectToDatabase();

// configure express app
const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
