# Software Architecture

This is a JavaScript project using Express, Passport, and JWT for authentication.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Launching with docker

1. Launch the docker-compose file

```sh
docker-compose -f ./docker/docker-compose.yml up -d
```

`-d` to detach the execution form your terminal

`--build` to build your container every time you run this command

Database data is stored in folder: `./database/mysql-data`

2. Show docker logs

```sh
docker-compose -f ./docker/docker-compose.yml logs -f --tail 20
```

`-f` to follow the logs

`--tail <number>` Number of lines to show from the end of the logs for each container (default "all")

or

```sh
docker logs -f --tail 20 <nom-du-container>
```

3. Stop containers

```sh
docker-compose -f ./docker/docker-compose.yml stop
```

4. Stop and remove containers

```sh
docker-compose -f ./docker/docker-compose.yml down
```

### Local Installing and Local Launching

1. Clone the repository

```sh
git clone <repository-url>
```

2. Install the dependencies

```sh
npm install
```

3. Start the server

```sh
npm start
```

Built With
Express - The web framework used
Passport - Authentication middleware for Node.js
JWT - Used for generating and validating JSON Web Tokens
