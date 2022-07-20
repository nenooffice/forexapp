# Forex App API

Project developed for Westpoint Academy.

## Requirement

- **Node** with version superior or same as 16.15.0 - [Node Download](https://nodejs.org/pt-br/download/)
- **NPM** with version superior or same as 8.5.5 - [Npm Download](https://www.npmjs.com/package/download)
- **Nest.js** with version superior or same as 8.5.5 - [Nest Download](https://docs.nestjs.com/)


## Instalation

Clone this project in your PC with this command (Key SSH needed):

```bash
#!/bin/bash
$ git clone git.github.com/nenooffice/projeto-M4.git
```

Acess you project folder:

```bash
#!/bin/bash
$ cd projeto-M4
```
Install the dependencies with nthis command:

```bash
#!/bin/bash
$ npm install
```

## Execution

After installed dependencies, use the next command to execute your project on a local server.

```bash
#!/bin/bash
$ npm run start:dev
```
To work with a local or cloud database, you should create an .env file and add a connection URL, like example:

```md
DATABASE_URL="mongodb+srv://admin:12345@appforex.xyzabc.mongodb.net/test"
```

As a additional, the application requires and JWT secret, as the example:

```md
JWT_SECRET="055e0c8e-df4b-4856-9b05-548aa95fcb95"
```

## Funcionalities

To acess all endpoints list and application funcionalities, read our documentation on (Swagger)
(http://localhost:3334/docs/).

Also, you can analize our <a href="./db.pdf" download>Entity Relationship Diagram</a>

## Author

- Eugenio Bufalo Rodrigues


<div>
<a href="https://www.linkedin.com/in/eugenio-neno-rodrigues/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>

## License

Nest is [MIT licensed](LICENSE).
