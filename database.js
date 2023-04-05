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
const studentCollection = client.db('Startup').collection('students');

//adds a student to the database
async function addStudnet(student) {
  console.log(student);
  console.log(student.password);
  const passwordHash = await bcrypt.hash(student.password, 10);
  
  const user = {
    username: student.username,
    password: passwordHash,
    token: uuid.v4(),
    question: "",
  }
  await studentCollection.insertOne(user);
  return user;
}

//finds a student for logining in
async function getStudent(studentUser) {
  //let theId = new ObjectId(ID);
  console.log(studentUser);
  const query = {username: studentUser};
  console.log(query);
  const cursor = await studentCollection.findOne(query);
  console.log(cursor);
  return cursor;
}

module.exports = {addStudnet, getStudent};
