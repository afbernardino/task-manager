const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

// create new user
router.post("/users", async (req, res) => {
  try {
    if (req.body.email) {
      // check wether or not the current email already exist to return an
      // explicit message
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send({ error: "E-mail already in use. Please try another e-mail." });
      }
    }

    const newUser = new User(req.body);
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res.status(201).send({ user: newUser, token });
  } catch (e) {
    res.status(400).send();
  }
});

// user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// user logout from a single session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// user logout from all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// retrieves user information
router.get("/users/self", auth, async (req, res) => {
  res.send(req.user);
});

// updates user information
router.patch("/users/self", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid field update!" });
  }

  try {
    if (req.body.email) {
      // check wether or not the current email already exist to return an
      // explicit message
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).send({ error: "E-mail already in use. Please try another e-mail." });
      }
    }

    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(400).send();
  }
});

// deletes a user
router.delete("/users/self", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
