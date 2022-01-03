# Go Chat
![gochat](https://user-images.githubusercontent.com/48105703/147529163-f94ff76e-e984-471b-951e-31dbb70314ea.png)

## How to run
This application requires `Docker` and `Docker compose`. Please install them first.
* [Docker installation](https://www.docker.com/get-started)
* [Docker compose installation](https://docs.docker.com/compose/install/)

To run the app, use the following command:
```
docker-compose up --build
```
When it is ready, visit [here](http://localhost:8080)

## Architecture
![architecture](https://user-images.githubusercontent.com/48105703/147528514-619615f9-378a-4174-ab1a-ef13129e3631.png)

`Go` server and `React` server communicate via WebSocket. In addition, `Go` server provides a REST API to get all existing chats in the database.

## Notes
This application uses cookies to distinguish different users. To try this application using multiple users, please use multiple browsers.
