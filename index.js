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
  const student = await DB.getStudent(_req.params.id, _req.body.classroom);

  if (student){ //if there is a match to the username;
    console.log("found a student");
    if (await bcrypt.compare(_req.body.password, student.password)) { //if the passwords match
      setAuthCookie(res, student.token);
      res.send({
        id: student._id,
      }); 

      DB.updateLogged(_req.body.username, _req.body.classroom, 1);
      return;
    }
    else{
      console.log("invalid credentials 1");
      res.status(409).send({ msg: 'invalid credentials' })
    }
  }
  else{
    console.log("invalid credentials 2");
    res.status(409).send({ msg: 'invalid credentials' })
  }
});

//Register for a single student
apiRouter.post('/student', async (req, res) => {
  if(req.body.username === '' || req.body.password === '' || req.body.classroom === ''){
    console.log("Missing required information");
    res.status(409).send({ msg: 'Missing required infomation'});
    return;
  }
  if (await DB.getStudent(req.body.username, req.body.classroom) != null) { //this also catches if the classromm collection doesn't exist
    console.log("found existing user");
    res.status(409).send({ msg: 'Existing user'});
  } else{
    console.log("Adding new student")
    const student = await DB.addStudnet(req.body);

    if(student === 0){
      console.log('Collection does not exist');
      res.status(409).send({ msg: 'Collection does not exist'});
      return;
    }
    else{
      //sets the cookie
      setAuthCookie(res, student.token);
      res.send(student);
    }
  }
});

//login for a teacher
apiRouter.post('/teacher/:id', async (_req, res) => {
  console.log(`This is the id ${_req.params.id}`);
  const teacher = await DB.getTeacher(_req.params.id);

  if (teacher){ //if there is a match to the username;
    console.log("found a teacher");
    if (await bcrypt.compare(_req.body.password, teacher.password)) { //if the passwords match
      setAuthCookie(res, teacher.token);
      res.send({
        id: teacher._id,
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

//register a teacher
apiRouter.post('/teacher', async (req, res) => {
  console.log('registering a teacher')
  console.log(req.body.classroom);
  if(req.body.username === '' || req.body.password === '' || req.body.classroom === ''){
    console.log("Missing required information");
    res.status(409).send({ msg: 'Missing required infomation'});
    return;
  }
  else if (await DB.getTeacher(req.body.username) != null) {
    console.log("found existing teacher");
    res.status(409).send({ msg: 'Existing user' });
  } 
  else{
    console.log("Adding new teacher")
    const teacher = await DB.addTeacher(req.body);

    //sets the cookie
    setAuthCookie(res, teacher.token);

    res.send(teacher);
  }
});

//helps verify credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  console.log("IN AUTHENTICATION")
  authToken = req.cookies[authCookieName];
  console.log(authToken);

  const user = await DB.getUserByToken(authToken, req.body.classroom);

  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//Updates the student status
apiRouter.post('/status', async (req, res) => {
  console.log("UPDATING STUDENT");
  const updatedStudent = await DB.updateStudentStatus(req.body.username, req.body.classroom, req.body.status);

  res.send({
    id: updatedStudent._id,
  }); 
  return;
})

//sending a question to the database
apiRouter.post('/question', async (req, res) => {
  console.log('ADDING QUESTION');
  const updatedQuestion = await DB.updateQuestion(req.body.username, req.body.classroom, req.body.question);

  res.send({
    id: updatedQuestion._id,
  }); 
  return;
})

// Get all the students for the teacher view
apiRouter.post('/students', async (req, res) => {
  const students = await DB.getStudents(req.body.studentClassroom);
  res.send(students);
})

// Update the student with a the answer
apiRouter.post('/answer', async (req, res) => {
  console.log(req.body.studentClassroom);
  console.log(req.cookies[authCookieName]);
  console.log(req.body.answer);
  const update = await DB.updateAnswer(req.body.studentClassroom, req.cookies[authCookieName], req.body.answer);
  res.send({
    id: update._id,
  }); 
})

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

//deletes authToken if stored in a cookie
apiRouter.delete('/auth/logout', async (_req, res) => {
  console.log('Deleting the cookie');
  console.log(_req.body.username);
  await DB.updateLogged(_req.body.username, _req.body.classroom, 0);
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