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
  let resp = JSON.stringify(student);
  console.log(`here is the ${resp}`);
  res.send(resp);
});

// Submit a single student
apiRouter.post('/student', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else{
    added = DB.addStudnet(req.body);
    res.send(added);
  }
});

// Adding student to the teacher view

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});