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

//adds a student to the database
async function addStudnet(student) {
  console.log("in addStudent");
  const studentCollection = client.db('Startup').collection(`${student.classroom}`);
  console.log(student);
  console.log(student.password);
  const passwordHash = await bcrypt.hash(student.password, 10);
  
  const user = {
    username: student.username,
    password: passwordHash,
    classroom: student.classroom,
    token: uuid.v4(),
    question: "",
  }
  await studentCollection.insertOne(user);
  return user;
}

//finds a student for logining in
async function getStudent(studentUsername, classroom) {
  console.log("finding a student");
  console.log(classroom);
  const studentCollection = client.db('Startup').collection(`${classroom}`);
  //let theId = new ObjectId(ID);
  console.log(studentUsername);
  const query = {username: studentUsername};
  console.log(query);
  const student = await studentCollection.findOne(query);
  console.log(student);
  return student;
}

//adds a teacher to the database
async function addTeacher(teacher) {
  console.log(teacher);
  console.log(teacher.password);
  const passwordHash = await bcrypt.hash(teacher.password, 10);
  
  const user = {
    username: teacher.username,
    password: passwordHash,
    token: uuid.v4(),
  }
  await teacherCollection.insertOne(user);
  return user;
}

//finds if a teacher is in the database
async function getTeacher(teacherUser) {
  //let theId = new ObjectId(ID);
  console.log(teacherUser);
  const query = {username: teacherUser};
  console.log(query);
  const teacher = await teacherCollection.findOne(query);
  console.log(teacher);
  return teacher;
}

module.exports = {addStudnet, getStudent, addTeacher, getTeacher};
