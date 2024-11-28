## Description

This is a code challenge for bankuish

## Docker Project setup

The first thing you need to do after cloning the repo is add your user-authentication.json file in the root directory, since this project use firebase authentication this file is crucial.
I already send it my user-authentication file but you can add your own if you have your firebase web app created.

After you add your firebase-authentication.json file, you have to go to the .env file and change the value of the 'FIREBASE_API_KEY' variable and add your own api key or the one that I sent in the mail.

The last step to run the project use to execute this command:
```bash
$ docker compose up
```

This command will install all neccesary dependencies in the project, for example: packages, create 3 images:
1. The bankuish_app
2. The PostgreSQL server
3. PgAdmin to visualize the different databases and tables.

After you run this command you won't have any problem to access to the services

You can visit this: http://localhost:3000/api
to see the api documentation.

Also you can visit: http://localhost:5050/browser/
to get to pgAdmin.

Here is the pgAdmin credentials:
Email = admin@admin.com
Password = pgadmin4

## Compile and run local project

If you want to run the project locally, you have to add the user-authentication.json file previously mentioned for firebase authentication, also change the 'FIREBASE_API_KEY' value.

After that you have to run this script to install all project dependencies:

```bash
$ npm install
```

If you want to compile the project you have to run this command:

```bash
$ npm run start:dev
```