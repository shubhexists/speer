# Speer Assesment

This is a note managing backend server written in expressJS with JWT authentication and MongoDB.
NOTE - 
1) Since, this was a Demonstration, I did not find it necessary to hide the MongoDB URL. So, you can directly clone and run the project.
2) This Projects does NOT have a seperate TestDB, which isn't recommended in a production server.

# Dependency Overview
### Express:
It was used for building the RESTful API and handling HTTP requests.
### Mongoose:
It was a package used for managing MongoDB database.
### JsonWebToken:
It was used to implement JWT for authentication.
### Helmet:
It is a security dependency that sets specific headers that help secure the API routes.
### Morgan:
Used for logging
### Cors:
Used for handling cross-origin requests.
### Body-Parser:
Used for parsing JSON and URL-encoded request bodies.
### Jest and SuperTest: 
Used to create and run tests for the APIs
### express-rate-limit:
Used to rate limit the APIs to prevent spam.
### dotenv
Used to load the ` .env ` file.

# Installation 

1. Clone the repository:
```
git clone https://github.com/shubhexists/speer
```
2. cd into the directory and install the dependencies.
```
cd speer
npm i
```
3. Run the server
```
node server.js
```
4) Run Tests
```
npm test
```

# Extra Details 

Search functionality is implemented using the regex property provided by mongoose. It searches the word in both the title and content of the Notes.
