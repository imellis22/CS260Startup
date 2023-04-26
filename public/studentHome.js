

function boldBorder(x) {
    x.style.border = "4px solid black";
    x.style.color = "black"
}

function noBorder(x) {
    let status = localStorage.getItem('status');
    let current;

    if(status == 1){
        current = "one"
    }
    else if(status == 2){
        current = "two"
    }
    else{
        current = "three"
    }
    
    if(current == x.id){
        x.style.border = "4px solid black";
        x.style.color = "black"
    }
    else{
        x.style.border = "none"
    }
}

function maintainBorder(){
    let status = localStorage.getItem('status');
    let button;

    if(status == 1){
        button = document.querySelector("#one")
    }
    else if(status == 2){
        button = document.querySelector("#two")
    }
    else{
        button = document.querySelector("#three")
    }

    button.style.border = "4px solid black";
    button.style.color = "black"
}

function setName(){
    const userName = document.querySelector('#studentName');
    userName.textContent = "Welcome " + localStorage.getItem('studentName');
}

//will send a new question to the database when student clicks on it
async function sendQuestion(){
    const question = document.querySelector('#studentQuestion');
    let userName = localStorage.getItem('studentName')
    let classroomEl = localStorage.getItem('classroom');

    let newQuestion = 
    {
        username: userName,
        classroom: classroomEl,
        question: question.value,
    }
    console.log(question.value);
    await fetch(`/api/question`, {      
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newQuestion),
    })
}

//Will update the student status
async function updateStatus(button, status){
    console.log(`UPDATING STATUS ${status}`);
    let userName = localStorage.getItem('studentName')
    let classroomEl = localStorage.getItem('classroom');
    localStorage.setItem('status', status);
    
    let update = 
    {
        username: userName,
        classroom: classroomEl,
        status: status
    }
    console.log
    await fetch(`/api/status`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(update),
    })

    const goodButton = document.querySelector("#three");
    const okayButton = document.querySelector("#two");
    const badButton = document.querySelector("#one");

    goodButton.style.border = "none";
    okayButton.style.border = "none";
    badButton.style.border = "none";

    button.style.border = "4px solid black";
    button.style.color = "black"
}

// Gets answer from the database
async function getAnswer(){
    let usernameEl = localStorage.getItem('studentName');
    let classroomEl = localStorage.getItem('classroom');
    console.log("GETTING ANSWER")
    
    let answerReq =
    {
        username: usernameEl,
        classroom: classroomEl,
    }
    
    const response = await fetch(`/api/find/answer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answerReq),
    });

    const answer = await response.json();
    console.log(answer);
    let answerText = document.querySelector("#studentAnswer");
    answerText.textContent = answer.answer;
}

//to delete your authToken cookie
async function logout() {
    console.log("logging out");
    let usernameEl = localStorage.getItem('studentName');
    let classroomEl = localStorage.getItem('classroom');
    await wipeAnswer();
    
    let logout =
    {
        username: usernameEl,
        classroom: classroomEl,
    }

    await fetch(`/api/auth/logout`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(logout),
    });
    window.location.href = '/';


    /*
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
    */
}

async function wipeAnswer(){
    let classroomEl = localStorage.getItem('classroom');

    let wipeAnswer = 
    {
        studentClassroom: classroomEl, 
        answer: "",
    }

    await fetch('/api/answer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(wipeAnswer),
    });
}

async function authenticate(){
    let classroom = localStorage.getItem('classroom');
    console.log(classroom);
    if(classroom === null){
        window.location.href = '/'
    }
    else{
        let authenticate = {
            classroom: classroom
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
getAnswer();
setName();
maintainBorder();