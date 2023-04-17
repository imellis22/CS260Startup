
let numStudents = 0; 

async function loginTeacher() {
    const nameEl = document.querySelector("#teacherName");
    const passwordEl = document.querySelector("#teacherPassword");
    localStorage.setItem("teacherName", nameEl.value);
    let teacher =
    {
        username: nameEl.value,
        password: passwordEl.value,
    }
    
    //http request to try and register a new student
    const login = await fetch(`/api/teacher/${nameEl.value}`, {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(teacher),
    })
    
    let status = login.status;
    console.log(status);
    if(status === 200){
        window.location.href = "teacherHome.html";
    }
    else{
        window.location.href = "login.html"
    }
}

async function registerTeacher(){
    const nameEl = document.querySelector("#teacherName");
    const passwordEl = document.querySelector("#teacherPassword");
    const classroomEl = document.querySelector("#teacherClassroom");
    localStorage.setItem("teacherName", nameEl.value);
    let newTeacher =
    {
        username: nameEl.value,
        password: passwordEl.value,
        classroom: classroomEl.value,
    }
    
    //http request to try and register a new teacher
    const add = await fetch('/api/teacher', {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newTeacher),
    })

    //checks to see if the response from registering a new user is 200
    console.log(add.status);
    let status = add.status;
    console.log(status);
    if(status === 200){
        window.location.href = "teacherHome.html";
    }
    else{
        window.location.href = "login.html"
    }
}

//Student functions
async function loginStudent() {
    const nameEl = document.querySelector("#studentName");
    const passwordEl = document.querySelector("#studentPassword");
    const classroomEl = document.querySelector("#classroomID");
    localStorage.setItem("studentName", nameEl.value);
    let student =
    {
        username: nameEl.value,
        password: passwordEl.value,
        classroom: classroomEl.value,
    }
    
    //http request to try and register a new student
    const login = await fetch(`/api/student/${nameEl.value}`, {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(student),
    })
    
    let status = login.status;
    console.log(status);
    if(status === 200){
        window.location.href = "studentHome.html";
    }
    else{
        window.location.href = "login.html"
    }
}

async function registerStudent() {
    const nameEl = document.querySelector("#studentName");
    const passwordEl = document.querySelector("#studentPassword");
    const classroomEl = document.querySelector("#classroomID");
    localStorage.setItem("studentName", nameEl.value);
    let newStudent =
    {
        username: nameEl.value,
        password: passwordEl.value,
        classroom: classroomEl.value,
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
        window.location.href = "login.html"
    }
}