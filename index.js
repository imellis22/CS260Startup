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

//tells the file to use the imported cookieParser
app.use(cookieParser());

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


let authCookieName = 'token';

// Get a single student, using for logging
apiRouter.post('/student/:id', async (_req, res) => {
  console.log(`This is the id ${_req.params.id}`);
  const student = await DB.getStudent(_req.params.id);

  if (student){ //if there is a match to the username;
    console.log("found a student");
    if (await bcrypt.compare(_req.body.password, student.password)) { //if the passwords match
      setAuthCookie(res, student.token);
      res.send({
        id: student._id,
      }); 
      return;
    }
    else{
      console.log("invalid credentials");
      res.status(409).send({ msg: 'invalid credentials' })
    }
  }
  else{
    console.log("invalid credentials");
    res.status(409).send({ msg: 'invalid credentials' })
  }

  /* used for debugging
  console.log(student.username);
  let resp = JSON.stringify(student);
  console.log(`here is the ${resp}`);
  */
});

//Register for a single student
apiRouter.post('/student', async (req, res) => {
  if (await DB.getStudent(req.body.username) != null) {
    console.log("found existing user");
    res.status(409).send({ msg: 'Existing user' });
  } else{
    console.log("Adding new student")
    const student = await DB.addStudnet(req.body);

    //sets the cookie
    setAuthCookie(res, student.token);

    res.send(student);
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

//deletes authToken if stored in a cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  console.log('Deleting the cookie')
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});