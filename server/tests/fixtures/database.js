const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "userOne",
  email: "userone@example.com",
  password: "userOne!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "userTwo",
  email: "usertwo@example.com",
  password: "userTwo!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "First task",
  description: "First task description",
  completed: false,
  owner: userOne._id,
  toStartAt: new Date("01-01-2019"),
  toEndAt: new Date("01-01-2019")
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Second task",
  description: "Second task description",
  completed: true,
  owner: userOne._id,
  toStartAt: new Date("01-02-2019"),
  toEndAt: new Date("01-02-2019")
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Third task",
  completed: true,
  owner: userOne._id,
  toStartAt: new Date("01-03-2019"),
  toEndAt: new Date("01-03-2019")
};

const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  title: "Fourth task",
  completed: true,
  owner: userTwo._id
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();

  await Task.deleteMany();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  await new Task(taskFour).save();
};

module.exports = {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  setupDatabase
};
