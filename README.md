## How to run the project

- Project is written using Nodejs with Typescript, and Mongodb database, Mongoose ODM is used for interacting with Mongodb

### Steps
- Folder named `kilowatt` contains Mongodb database dump, the dump is created using mongodump tool, so you can use mongorestore tool for importing the database, the database name is `kilowatt`
- You can use `mongorestore --uri="mongodb://user@mongodb1.example.net:27017/?authSource=admin" /put_the_path_to_kilowatt_folder_here`, to import the database, replace uri with your Mongodb uri
- Import file named `Kilowatt.postman_collection.json`(postman collection) into Postman
- `src` folder contains Typescript source files
- `dist` folder contains Javascript files generated from Typescript compilation
- Copy `.env.development` to `.env`, this file will contain environment variables
- Update `PORT` variable to the port number on which you want to run application server, default is 8080
- run `npm install`
- run `npm run dev` to run the application for development mode with Typescript, or you can run `node dist/app.js` to run with Nodejs directly the production usable generated Javascript files.

### Admin Credentials
Email - admin@admin.com
Password - 6ea245d29e20c58822d826528644e090

### Api Endpoints

#### Note - Send the access_key returned in login api json response in authorization header, with 'Bearer ' added as the prefix, for example 

![kilowott2](https://user-images.githubusercontent.com/23162713/166186699-e0c41fd4-2c5d-4a47-99f9-783e3ec41c0a.png)

![kilowott1](https://user-images.githubusercontent.com/23162713/166186712-8e5866c7-212a-4537-ae01-b80b096ff17f.png)

| Path  | Method | Description |
| ------------- | ------------- | ------------- |
| /user/login  | POST | Login a user, in the json response unique user id, session expiry time, and access_key is returned, access_key is authorization token, this can be used on subsequent requests to be send in authorization header for authorization, request content type is json, disabled and deleted users not allowed |
| /user | POST | Add a new user, , request content type is json, only allowed for admin user |
| /user/:userId | POST | Delete a user, :userId is dynamic, it is the unique id of the user, only allowed for admin users |
| /user | GET | Returns all non-admin users, returnes first_name, last_name, email, address(home, work), id, status, role of each user, only allowed for admin users |
| /user/:userId/status/inactive | PUT | Disables a user, :userId is dynamic, it is the unique id of the user, only allowed for admin users |
| /user | PUT | Updates a user, fist_name, last_name, and address(home, work) can be update, email cannot be updated, a user can update their own details only, user id will be taken from user id attached to the access_key provided in authorization header, request content type is json |
| /user/password | PUT | Change password, new password is provided in json request body in password property, a user can change their password only, user id will be taken from user id attached to the access_key provided in authorization header, request content type is json |
| /user/profilepic | PUT | Updating profile picture, only files upto 2mb allowed and only JPEF and PNG file types is allowed, request content type is multipart/form-data, file has to be provided in profile_pic field, a user can update their profile picture only, user id will be taken from user id attached to the access_key provided in authorization header |




