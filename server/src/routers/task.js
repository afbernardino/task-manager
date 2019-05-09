const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

// creates new tasks
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send();
  }
});

// retrieves the tasks for a given user.
// Some options may be:
//  - /tasks?completed=true
//  - /tasks?limit=10&skip=20
//  - /tasks?sortBy=toStartAt:desc
//  - /tasks/?afterStart=<ISOString>&beforeEnd=<ISOString>
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  // completed or uncompleted tasks
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  // tasks to be started after start date (start date included)
  if (req.query.afterStart) {
    match.toStartAt = { $gte: new Date(req.query.afterStart) };
  }

  // tasks to be started before start date (start date not included)
  if (req.query.beforeStart) {
    match.toStartAt = { $lt: new Date(req.query.beforeStart) };
  }

  // tasks to be ended after end date (end date not included)
  if (req.query.afterEnd) {
    match.toEndAt = { $gt: new Date(req.query.afterEnd) };
  }

  // tasks to be ended before end date (end date included)
  if (req.query.beforeEnd) {
    match.toEndAt = { $lte: new Date(req.query.beforeEnd) };
  }

  // sort tasks
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// retrieves task by its id and user
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// updates task information
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "completed"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send();
  }
});

// deletes a task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
