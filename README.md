# BuddyConnect - server

## Enviroment variables

| Variables                | Description          |
| ------------------------ | -------------------- |
| `PORT`                   | server port number   |
| `POSTGRES_LOCAL_PORT`    | db port              |
| `POSTGRES_HOST`          | db host              |
| `POSTGRES_USER`          | db user              |
| `POSTGRES_DB`            | db name              |
| `POSTGRES_PASSWORD`      | db user password     |
| `HASH_SALT`              | hash salting number  |
| `JWT_SECRET_KEY`         | JWT secret key       |
| `JWT_EXPIRY`             | JWT expiration       |
| `MEDIA_STORAGE_BASE_URL` | media storage domain |

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
