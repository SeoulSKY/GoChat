<div align="center">
    <img width="250" src="https://github.com/SeoulSKY/GoChat/assets/48105703/7e81a793-4d9a-40ba-b529-603ff176eadc">
    <h1>GoChat</h1>
</div>

<blockquote align="center">
    Say "Hello" to the diverse individuals in our seamless real-time conversational platform.
</blockquote>

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-v21.7-84ba64" alt="nodejs">
    <img src="https://github.com/SeoulSKY/GoChat/actions/workflows/eslint.yml/badge.svg" alt="eslint">
</div>

[Click here for demo](https://gochat.seoulsky.org)

## Overview

### Home

![home](https://github.com/SeoulSKY/GoChat/blob/main/assets/home.gif)

### Chat Room

![chatroom](https://github.com/SeoulSKY/GoChat/assets/48105703/c03988b8-9046-4f49-a158-9c081e97f54a)

## How to Set up and Run

### Running with [Docker](https://www.docker.com/get-started)

Run the following command

```bash
# For Production
docker compose pull && docker compose up -d

# For Development
docker compose -f docker-compose-dev.yml up --build -d
```

* When it is ready, visit [here](http://localhost:3000)

## Architecture

![architecture](https://user-images.githubusercontent.com/48105703/147528514-619615f9-378a-4174-ab1a-ef13129e3631.png)

`Go` server and `React` server communicate via WebSocket. In addition, `Go` server provides a REST API to get all existing chats in the database.
