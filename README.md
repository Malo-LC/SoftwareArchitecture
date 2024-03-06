# Software Architecture

This is a JavaScript project using Express, Passport, and JWT for authentication.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Launching with docker

1. Launch the docker-compose file

```sh
docker-compose -f /docker/docker-compose up
```

Optional - if necessary you can rebuild the container

```sh
docker-compose -f /docker/docker-compose up --build
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
