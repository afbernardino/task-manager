const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/user");
const { userOne, userTwo, setupDatabase } = require("./fixtures/database");

beforeEach(setupDatabase);

afterAll(() => mongoose.disconnect());

test("Should sign up new user", async () => {
  const name = "testUser";
  const email = "testuser@example.com";
  const password = "testUSer!!";

  const response = await request(app)
    .post("/users")
    .send({
      name,
      email,
      password
    })
    .expect(201);

  // expect the user to exist in the database
  const user = await User.findOne({ email });
  expect(user).not.toBeNull();

  // expect the correct response with no sensitive data
  expect(response.body).toMatchObject({
    user: {
      name,
      email
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe(password);
});

test("Should not sign up user with invalid e-mail address", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "testUser",
      email: "notavalidemail.com",
      password: "testUser!!"
    })
    .expect(400);
});

test("Should not sign up existing user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: userOne.name,
      email: userOne.email,
      password: userOne.password
    })
    .expect(400);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  // expect the token to be found in the database and at the response
  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login user with the wrong password", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "wrongpassword"
    })
    .expect(400);
});

test("Should logout user", async () => {
  const userOneToken = userOne.tokens[0].token;
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${userOneToken}`)
    .send()
    .expect(200);

  // expect the token not to be found in the database anymore
  const user = await User.findById(userOne._id);
  expect(user.tokens).not.toContain(userOneToken);
});

test("Should logout all user sessions", async () => {
  await request(app)
    .post("/users/logoutAll")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the tokens not to be found in the database anymore
  const user = await User.findById(userOne._id);
  expect(user.tokens.length).toEqual(0);
});

test("Should get user's profile", async () => {
  const response = await request(app)
    .get("/users/self")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the response to be correct
  expect(response.body).toMatchObject({
    name: userOne.name,
    email: userOne.email
  });
});

test("Should not get unauthenticated user's profile", async () => {
  await request(app)
    .get("/users/self")
    .send()
    .expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/self")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // expect the user to no nonexistent in the database anymore
  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/self")
    .send()
    .expect(401);
});

test("Should update user's profile", async () => {
  const name = "testUser";
  const email = "testuser@example.com";
  const password = "testUser!!";

  await request(app)
    .patch("/users/self")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name,
      email,
      password
    })
    .expect(200);

  // expect the database to have the user updated
  const user = await User.findById(userOne._id);
  expect(user.name).toBe(name);
  expect(user.email).toBe(email);
  expect(user.password).not.toBe(password);
});

test("Should not update user's profile if not authenticated", async () => {
  await request(app)
    .patch("/users/self")
    .send({
      name: "testUser",
      email: "testuser@example.com",
      password: "testUser!!"
    })
    .expect(401);
});

test("Should not update user's e-mail to an already existing one", async () => {
  await request(app)
    .patch("/users/self")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: userTwo.name,
      email: userTwo.email,
      password: userTwo.password
    })
    .expect(400);
});

test("Should not update invalid fields", async () => {
  await request(app)
    .patch("/users/self")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      age: 25
    })
    .expect(400);
});
