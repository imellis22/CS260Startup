
let numStudents = 0; 

function loginTeacher() {
    const nameEl = document.querySelector("#teacherName");
    localStorage.setItem("teacherName", nameEl.value);
    window.location.href = "teacherHome.html";
}

function loginStudent() {
    const nameEl = document.querySelector("#studentName");
    localStorage.setItem("studentName", nameEl.value);
    window.location.href = "studentHome.html";
    let newStudent =
    {
        id: numStudents,
        question:""
    }
    TEACHER.addStudent(newStudent);
    ++numStudents;
}

function registerTeacher(){

}

async function registerStudent() {
    const nameEl = document.querySelector("#studentName");
    const passwordEl = document.querySelector("#password");
    let newStudent =
    {
        username: nameEl,
        password: passwordEl,
        question:""
    }
    
    const add = await fetch('/api/student', {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newStudent),
    })
}