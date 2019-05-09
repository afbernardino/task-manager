# Task Manager Server

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

Create a file named "test.env" with the needed environment variables (see [above](#setup)), at the following folder tree:

```
/server
|-- env
    ` -- test.env
```

and run:

`npm test`

## Run on localhost

Create a file named "dev.env" with the needed environment variables (see [above](#setup)), at the following folder tree:

```
/server
|-- env
    ` -- dev.env
```

and run:

`npm run dev`
