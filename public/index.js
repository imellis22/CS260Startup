function loginTeacher() {
    const nameEl = document.querySelector("#teacherName");
    localStorage.setItem("teacherName", nameEl.value);
    window.location.href = "teacherHome.html";
}

function loginStudent() {
    const nameEl = document.querySelector("#studentName");
    localStorage.setItem("studentName", nameEl.value);
    window.location.href = "studentHome.html";
}