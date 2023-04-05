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

//adds one question to the database
async function addStudnet(student) {
  console.log(student.password);
  const passwordHash = await bcrypt.hash(student.password, 10);
  
  const user = {
    username: student.username,
    password: passwordHash,
    token: uuid.v4(),
  }
  await studentCollection.insertOne(user);
  return user;
}


function getStudent(studentUser) {
  //let theId = new ObjectId(ID);
  console.log(studentUser);
  const query = {username: studentUser};
  console.log(query);
  //const cursor = questionCollection.findOne({_id: new ObjectId(ID)});
  return studentCollection.find(query);
}

module.exports = {addStudnet, getStudent};
