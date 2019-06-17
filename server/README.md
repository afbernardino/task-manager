# Task Manager Server

This server was taken from [Andrew Mead's node course](https://github.com/andrewjmead/node-course-v3-code) and was tweaked a bit by me, namely:

- [Feature] Added data ranges (start date and end date) to tasks;
- [Feature] Removed user's profile picture;
- [Feature] Removed "Welcome" and "Good bye" e-mails;
- [Enhancement] Added a LOT more tests;
- [Enhancement] Added custom output messages when a user tries to use an already existing e-mail;
- [Enhancement] Changed the way that (the non-exposure of) sensitive data is handled.

## Installation

`npm i`

## Setup

Task Manager server expects to use MongoDB and needs the following environment variables to be set:

```
PORT=<server port number>
MONGODB_URL=<mongodb url> example: mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=<json web token secrect>

```

## Test

Create a file named "test.env" with the needed environment variables (see the [Setup section](#setup)), at the following folder tree:

```
/server
|-- env
    ` -- test.env
```

and run:

`npm test`

## Run on localhost

Create a file named "dev.env" with the needed environment variables (see the [Setup section](#setup)), at the following folder tree:

```
/server
|-- env
    ` -- dev.env
```

and run:

`npm run dev`
