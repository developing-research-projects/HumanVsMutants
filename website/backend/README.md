# Backend

This is the backend for task 1 NodeJS + ExpressJS + Prisma ORM

Documentation in:

- <https://expressjs.com/en/starter/generator.html>
- <https://expressjs.com/en/starter/examples.html#additional-examples>
- <https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-express>

## Install dependencies

```bash
 cd task1/backend
 npm ci
```

## Configure .env file

- Create a copy of `.env.sample` and rename the copy to `.env`.

- Get Environment variables from Discord's pinned post. (research forum > Task 1: Building a website for assigning tasks)
- You can Set `ADMIN_USERNAMES` as your GitHub username for admin access.

## Migrate database

```bash
 npm run migrate
```

## Run the app locally

```bash
 npm run dev
```

## Run tests

```bash
 npm test
```
