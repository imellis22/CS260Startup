let numStudents = 0;
let locStudents = []; 
const theStudent = 
{
    id: 0,
    question:""
}

let currQuestion;
let reading = 0;

function addStudent(currStu) {
    const theStudent = new Object();
    let currValue; 
    // if(reading === 0){
    //     currValue = numStudents;
    // }
    // else if(reading === 1){
    //     currValue = currStu;
    // }

    theStudent.id = locStudents[currStu].username;

    //need to get the student status to determine what background to have
    let statusClass;
    if(locStudents[currStu].status === 1){
        statusClass = 'bad';
    }
    else if(locStudents[currStu].status === 2){
        statusClass = 'okay';
    }
    else if(locStudents[currStu].status === 3){
        statusClass = 'good';
    }


    const studentList = document.querySelector('#main-page');

    const student = document.createElement('div'); //the main div for the student
    student.classList.add('student');
    student.classList.add(`${statusClass}`);

    const name = document.createElement('div'); 
    name.classList.add('student-info');
    name.textContent = locStudents[currStu].username; 

    const question = document.createElement('div');
    question.classList.add('question');
    question.textContent = locStudents[currStu].question;
    theStudent.question = question.textContent;

    // console.log(theStudent.id);
    // console.log(theStudent.question);

    name.appendChild(question); //adds the question child to the name div

    student.appendChild(name); //adds the student name with the question child to the main student div

    const buttons = document.createElement('span'); //creates the span for the buttons
    buttons.classList.add('buttons');

    const responseButton = document.createElement('button');

    responseButton.classList.add('btn', 'btn-primary', 'response-btn');
    responseButton.id = currStu;
    responseButton.textContent = "Give Answer";
    responseButton.setAttribute("onclick","makeModal(this)");
//    responseButton.onclick = "makeModal(this)"; ///////

    buttons.appendChild(responseButton);

    student.appendChild(buttons);//adds buttons to the student div
    

    studentList.appendChild(student);

    localStorage.setItem("numStudents", numStudents);
}

async function readInStudents(){ //going to need to read in the students    
    let i = 0;
    reading = 1; 

    let students = [];

    let studentClassroom = localStorage.getItem('classroom');

    let info = 
    {
        classroom: "teachers",
        studentClassroom: studentClassroom,
    }
    const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(info),
    });
    students = await response.json();

    localStorage.setItem('students', JSON.stringify(students));

    let studentText = localStorage.getItem('students');
    locStudents = JSON.parse(studentText);
    //Need to check if the array in local storage is null, and if it is don't get it from the storage
    //students = JSON.parse(localStorage.getItem('Students'));
    
    let length;
    if(locStudents !== null){
        length = locStudents.length;
        console.log(`THIS IS THE LENGTH ${length}`);
        console.log(locStudents[0].status);
    }
    else{
        locStudents = [];
        length = 0;
    }
    while(i < length){
        addStudent(i);
        ++i;
    }
    numStudents = i;
    reading = 0;
    console.log(`This is the value of reading! ${reading}`);
}

function setName(){
    const userName = document.querySelector('#teacherName');
    userName.textContent = "Welcome " + localStorage.getItem('teacherName');
}

function makeModal(clicked){
    console.log(`this is the clicked id ${clicked.id}`);
    const modal = document.getElementById("theModal");
    modal.style.display = "block";

    const modalBody = document.querySelector(".modal-body");
    modalBody.id = clicked.id;

    const question = locStudents[clicked.id].question;
    console.log(question);
    const theQuestion = document.getElementById("theQuestion");
    theQuestion.textContent = `${question}`;
    currQuestion = clicked.id;          //This is to get the correct question for making the modal persist past a refresh
}

function closeModal(){
    const modal = document.getElementById("theModal");
    modal.style.display = "none";
}

async function saveAnswer() {
    const answer = document.getElementById("theAnswer");
    let element = document.querySelector(".modal-body");
    console.log(element.id);
    let username = locStudents[element.id].username;
    //console.log(`The students username ${username}`);
    let classroom = locStudents[element.id].classroom;
    let theAnswer = 
    {
        answer: answer.value,
        username: username,
        classroom: 'teachers',
        studentClassroom: classroom,
    }
    await fetch('/api/answer',  {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(theAnswer),
    });
}

//to delete your authToken cookie
function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
}

async function authenticate(){
    let classroom = localStorage.getItem('classroom');
    console.log(classroom);
    if(classroom === null){
        window.location.href = '/'
    }
    else{
        let authenticate = {
            classroom: 'teachers'
        }

        let auth = await fetch('/api/authenticate', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(authenticate),
        });

        if(auth.status !== 200){
            window.location.href = '/'
        }
    }
}

authenticate();
setName();
readInStudents();