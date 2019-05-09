const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const Task = require("../src/models/task");
const {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  setupDatabase
} = require("./fixtures/database");

beforeEach(setupDatabase);

afterAll(() => mongoose.disconnect());

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "Test task",
      description: "This is my test task"
    })
    .expect(201);

  // expect task to be stored in the database with defaults
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should not create task with no title", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "This is my test task"
    })
    .expect(400);
});

test("Should not create task if not authenticated", async () => {
  await request(app)
    .post("/tasks")
    .send({
      title: "Test task"
    })
    .expect(401);
});

test("Should get user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(3);
});

test("Should not get user tasks if not authenticated", async () => {
  await request(app)
    .get("/tasks")
    .send()
    .expect(401);
});

test("Should get completed user tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(2);
});

test("Should get uncompleted user tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(1);
});

test("Should get ordered tasks by start date", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=toStartAt:desc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(3);

  // expect the correct order
  expect(response.body[0]._id).toEqual(taskThree._id.toHexString());
  expect(response.body[1]._id).toEqual(taskTwo._id.toHexString());
  expect(response.body[2]._id).toEqual(taskOne._id.toHexString());
});

test("Should get ordered tasks by end date", async () => {
  const response = await request(app)
    .get("/tasks?sortBy=toEndAt:asc")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(3);

  // expect the correct order
  expect(response.body[0]._id).toEqual(taskOne._id.toHexString());
  expect(response.body[1]._id).toEqual(taskTwo._id.toHexString());
  expect(response.body[2]._id).toEqual(taskThree._id.toHexString());
});

test("Should get tasks between dates", async () => {
  const startDate = new Date("01-02-2019").toISOString();
  const endDate = new Date("01-03-2019").toISOString();

  const response = await request(app)
    .get(`/tasks?afterStart=${startDate}&beforeEnd=${endDate}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(2);
});

test("Should get page of tasks", async () => {
  const response = await request(app)
    .get("/tasks?limit=2&skip=1")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the correct number of user tasks
  expect(response.body.length).toEqual(2);
});

test("Should get task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect correct response body
  expect(response.body).toMatchObject({
    title: taskOne.title,
    description: taskOne.description,
    completed: taskOne.completed
  });
});

test("Should not get other user's task", async () => {
  await request(app)
    .get(`/tasks/${taskFour._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should not get task by id if not authenticated", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test("Should update task", async () => {
  const title = "First task change";
  const description = "First task description change";
  const completed = true;

  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title,
      description,
      completed
    })
    .expect(200);

  // expect the database to have the task updated
  const task = await Task.findById(taskOne._id);
  expect(task.title).toBe(title);
  expect(task.description).toBe(description);
  expect(task.completed).toBe(completed);
});

test("Should not update task if not authenticated", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .send({
      title: "First task change",
      description: "First task description change",
      completed: true
    })
    .expect(401);
});

test("Should not update oher user's task", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      title: "First task change",
      description: "First task description change",
      completed: true
    })
    .expect(404);
});

test("Should not update task with invalid fields", async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      body: "Task test body"
    })
    .expect(400);
});

test("Should delete task", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the task to not exist in the database anymore
  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Should not delete task if not authenticated", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);

  // expect the task to exist in the database
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not delete other user's tasks", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  // expect the task to exist in the database
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
