
let numStudents = 0; 

function loginTeacher() {
    const nameEl = document.querySelector("#teacherName");
    localStorage.setItem("teacherName", nameEl.value);
    window.location.href = "teacherHome.html";
}

function registerTeacher(){

}

//Student functions
function loginStudent() {
    const nameEl = document.querySelector("#studentName");
    localStorage.setItem("studentName", nameEl.value);
    window.location.href = "studentHome.html";
    let newStudent =
    {
        id: numStudents,
        question:""
    }
    
    ++numStudents;
}

async function registerStudent() {
    const nameEl = document.querySelector("#studentName");
    const passwordEl = document.querySelector("#studentPassword");
    localStorage.setItem("studentName", nameEl.value);
    let newStudent =
    {
        username: nameEl.value,
        password: passwordEl.value,
        question:""
    }
    
    //http request to try and register a new student
    const add = await fetch('/api/student', {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newStudent),
    })

    //checks to see if the response from registering a new user is 200
    console.log(add.status);
    let status = add.status;
    console.log(status);
    if(status === 200){
        window.location.href = "studentHome.html";
    }
    else{
        window.location.href = "index.html"
    }
}