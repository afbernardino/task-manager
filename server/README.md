# Task Manager Server

This server was taken from [Andrew Mead's node course](https://github.com/andrewjmead/node-course-v3-code) and was tweaked a bit by me, namely:

- [Feature] Added data ranges (start date and end date) to tasks;
- [Feature] Removed user's profile picture;
- [Feature] Removed "Welcome" and "Good bye" e-mails;
- [Feature] Enabled CORS requests;
- [Feature] Added a custom output message when a user tries to use an already existing e-mail;
- [Feature] Added default values for environment variables to be able to create a quick setup, without too much hassle.
- [Enhancement] Added a LOT more tests;
- [Enhancement] Changed the way that (the non-exposure of) sensitive data is handled.

## Quick setup

```
npm i
npm start
```

## Installation

`npm i`

## Setup

The task manager server expects to use MongoDB and needs the following environment variables:

```
PORT=<server port number>
MONGODB_URL=<mongodb url> example: mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=<json web token secrect>
```

**Environment variables defaults**

```
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=myjwtsecret
```

## Test

Create a file named "test.env" with the needed environment variables (see the [Setup section](#setup)), at the following folder tree:

```
/server
 `-- env
     ` -- test.env
```

and run:

`npm test`

## Run on localhost

You can create a file named "dev.env" with the expected environment variables, in order to replace the defaults (see the [Setup section](#setup)), at the following folder tree:

```
/server
 `-- env
     ` -- dev.env
```

and run:

`npm run dev`
