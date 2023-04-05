const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const questionCollection = client.db('Startup').collection('questions');

//adds one question to the database
function addQuestion(question) {
  questionCollection.insertOne(question);
}


function getQuestion(ID) {
  let theId = new ObjectId(ID);
  const query = {_id: theId};
  const cursor = questionCollection.findOne(query);
  return cursor;
}

module.exports = {addQuestion, getQuestion};
