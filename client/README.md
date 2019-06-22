# Task Manager Client

## Quick setup

```
npm i
npm run dev
```

Access http://localhost:3001 with your browser.

## Installation

`npm i`

## Setup

The task manager client uses the following environment variables:

```
PORT=<client port number>
TASKS_API_URL=<tasks address> example: http://localhost:3000
```

**Environment variables defaults**

```
PORT=3001
TASKS_API_URL=http://localhost:3000
```

If you choose to use webpack-dev-server for development, you can configure the `TASKS_API_URL` variable (yes, you only need this one) by creating a file named "dev.env", at the following folder tree:

```
/server
 `-- env
     ` -- dev.env
```

If you are going to use this in production or if you want to see which files are created by webpack you can then build the project by running the following command:

```
npm run build:dev - For development

or

npm run build:prod - For production
```

## Test

`npm test`

## Run on localhost

Run the following command:

`npm run dev`

and access http://localhost:3001 with your browser.
