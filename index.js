const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js'); //brings the database.js file into this one

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 5500;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the application's static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Get a single question
apiRouter.get('/student/:id', async (_req, res) => {
  console.log(_req.params.id);
  const student = await DB.getStudent(_req.params.id);
  console.log(student.username);
  let resp = JSON.stringify(student);
  console.log(`here is the ${resp}`);
  res.send(student);
});

//Register for a single student
apiRouter.post('/student', async (req, res) => {
  if (await DB.getStudent(req.body.username) != null) {
    console.log("found existing user");
    res.status(409).send({ msg: 'Existing user' });
  } else{
    console.log("Adding new student")
    const added = await DB.addStudnet(req.body);

    //sets the cookie
    setAuthCookie(res, added.token);
    res.send(added);
  }
});

//login for a student

// Adding student to the teacher view


// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});