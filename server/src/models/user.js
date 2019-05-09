const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid e-mail.");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

schema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

// removes user's sensitive and unnecessary data from server's response
schema.methods.toJSON = function() {
  const user = this;
  const userObject = { _id: user._id, name: user.name, email: user.email };
  return userObject;
};

// generates auth token for current user
schema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

// finds an user by its e-mail and password
schema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Authentication failed.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Authentication failed.");
  }

  return user;
};

// hashes user's password before saving it
schema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// delete user's tasks from database
schema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", schema);

module.exports = User;
