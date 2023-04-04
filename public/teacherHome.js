let numStudents = 0;
let students = []; 
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
    if(reading === 0){
        currValue = numStudents;
    }
    else if(reading === 1){
        currValue = currStu;
    }

    theStudent.id = currValue;

    const studentList = document.querySelector('#main-page');

    const student = document.createElement('div'); //the main div for the student
    student.classList.add('student');

    const name = document.createElement('div'); 
    name.classList.add('student-info');
    name.textContent = "Student Name"; 

    const question = document.createElement('div');
    question.classList.add('question');
    question.textContent = `Question will go here ${currValue}`;
    theStudent.question = question.textContent;

    console.log(theStudent.id);
    console.log(theStudent.question);

    name.appendChild(question); //adds the question child to the name div

    student.appendChild(name); //adds the student name with the question child to the main student div

    const buttons = document.createElement('span'); //creates the span for the buttons
    buttons.classList.add('buttons');

    const responseButton = document.createElement('button');

    responseButton.classList.add('btn', 'btn-primary', 'response-btn');
    responseButton.id = currValue;
    responseButton.textContent = "Give Answer";
    responseButton.setAttribute("onclick","makeModal(this)");
//    responseButton.onclick = "makeModal(this)"; ///////

    buttons.appendChild(responseButton);

    student.appendChild(buttons);//adds buttons to the student div
    

    studentList.appendChild(student);

    console.log(students[0]);
    //students.push(theStudent);
    if(reading === 0){  // This makes it so the program only increments the number of students and adds to array if not reading in. 
        students.push(theStudent);
        ++numStudents;
    }
    localStorage.setItem("Students", JSON.stringify(students));
    localStorage.setItem("numStudents", numStudents);
}

async function readInStudents(){ //going to need to read in the students
    //this will be for testing an enpoint to see if its working
    const response = await fetch('/api/question');
    console.log(response.json());
    let i = 0;
    reading = 1; 

    //Need to check if the array in local storage is null, and if it is don't get it from the storage
    students = JSON.parse(localStorage.getItem('Students'));
    //console.log(students.length);
    let length;
    if(students !== null){
        length = students.length;
    }
    else{
        students = [];
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
    const question = students[clicked.id].question;
    console.log(question);
    const theQuestion = document.getElementById("theQuestion");
    theQuestion.textContent = `${question}`;
    currQuestion = clicked.id;          //This is to get the correct question for making the modal persist past a refresh
}

function closeModal(){
    const modal = document.getElementById("theModal");
    modal.style.display = "none";
}

function saveAnswer() {
    const answer = document.getElementById("theAnswer");
    localStorage.setItem(`answer${currQuestion}`, answer.value);
}

setName();
readInStudents();