const {MongoClient} = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
//const studentCollection = client.db('Startup').collection('students');
const teacherCollection = client.db('Startup').collection('teachers');

//adds a student to the database for registering
async function addStudnet(student) {
  console.log("in addStudent");
  const studentCollection = client.db('Startup').collection(`${student.classroom}`);

  //checking to see if the collection exists before adding the student
  if(await client.db('Startup').listCollections({name: student.classroom}).hasNext()){
    console.log(student);
    console.log(student.password);
    const passwordHash = await bcrypt.hash(student.password, 10);
  
    const user = {
      username: student.username,
      password: passwordHash,
      classroom: student.classroom,
      logged: 1, //1 means logged in
      status: 2, //1 means bad, 2 okay, 3 good
      token: uuid.v4(),
      question: "",
      answer: "",
    }
    await studentCollection.insertOne(user);
    return user;
  }
}

//finds a student for loggining in
async function getStudent(studentUsername, classroom) {
  console.log("finding a student");
  console.log(classroom);
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  
  if(await client.db('Startup').listCollections({name: classroom}).hasNext()){
    console.log(studentUsername);
    const query = {username: studentUsername};
    console.log(query);
    const student = await studentCollection.findOne(query);

    console.log('The student to be returned')
    console.log(student);
    return student;
  }
  else{
    return 0;
  }
}

//adds a teacher to the database
async function addTeacher(teacher) {
  console.log(teacher);
  console.log(teacher.password);
  const passwordHash = await bcrypt.hash(teacher.password, 10);
  
  const user = {
    username: teacher.username,
    password: passwordHash,
    classroom: teacher.classroom,
    token: uuid.v4(),
  }
  await teacherCollection.insertOne(user);
  return user;
}

//finds if a teacher is in the database
async function getTeacher(teacherUsername) {
  console.log(teacherUsername);
  const query = {username: teacherUsername};
  console.log(query);
  const teacher = await teacherCollection.findOne(query);
  console.log(teacher);
  return teacher;
}

// const newStudent = await studentCollection.findOneAndUpdate(
//   {username: studentUsername},
//   { $set: {logged: 1}},
//   {returnNewDocument: true},
// )
// return newStudent;

//logs out a student
async function updateLogged(studentUsername, classroom, caller){
  const studentCollection = client.db('Startup').collection(`${classroom}`);

  await studentCollection.updateOne(
    {username: studentUsername},
    {$set:{logged: caller}}
  )
}

//Updates a student's status
async function updateStudentStatus(username, classroom, status){
  const studentCollection = client.db('Startup').collection(`${classroom}`);

  const newStudent = await studentCollection.findOneAndUpdate(
    {username: username},
    { $set: {status: status}},
    {returnNewDocument: true},
  )

  console.log(newStudent.status);
return newStudent;
}

async function updateQuestion(username, classroom, question){
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  const modQuestion = await studentCollection.findOneAndUpdate(
    {username: username}, //the query to match
    {$set: {question: question}},
  )

  return modQuestion;
}

async function getUserByToken(token, collection){
  const findCollection = client.db('Startup').collection(`${collection}`);
  return findCollection.findOne({token: token});
}

async function getStudents(classroom){
  console.log("GETTING A STUDENT");
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  const students = await studentCollection.find({logged: 1}, {"token": 0, "password": 0})
  
  return students.toArray();
}

async function updateAnswer(classroom, userName, answer){
  console.log("In database updating answer")
  console.log(`${classroom}`)
  console.log(`${answer}`)
  console.log(`${userName}`)
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  const modAnswer = await studentCollection.findOneAndUpdate(
    {username: userName}, //the query to match
    {$set: {answer: answer}},
  )

  return modAnswer;
}

async function getAnswer(classroom, username){
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  const answer = await studentCollection.findOne(
    {username: username},
    {answer: 1}
  )
  return answer;
}

module.exports = {addStudnet, getStudent, updateLogged, addTeacher, getTeacher,
  updateStudentStatus, updateQuestion, getUserByToken, getStudents, updateAnswer, getAnswer};
