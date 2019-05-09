const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    toStartAt: {
      type: Date
    },
    toEndAt: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// removes task's unnecessary data from server's response
schema.methods.toJSON = function() {
  const task = this;
  const taskObject = {
    _id: task._id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    toStartAt: task.toStartAt,
    toEndAt: task.toEndAt
  };
  return taskObject;
};

const Task = mongoose.model("Task", schema);

module.exports = Task;
