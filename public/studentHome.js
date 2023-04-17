function boldBorder(x) {
    x.style.border = "4px solid black";
    x.style.color = "black"
}

function noBorder(x) {
    x.style.border = "none"
}

function setName(){
    const userName = document.querySelector('#studentName');
    userName.textContent = "Welcome " + localStorage.getItem('studentName');
}

//will send a new question to the database when student clicks on it
async function sendQuestion(){
    const newQuestion = { student: "John", body: "What am I supposed to be doing?" };
    const add = await fetch('/api/question', {      
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newQuestion),
    })
}

//to delete your authToken cookie
async function logout() {
    console.log("logging out");
    let usernameEl = localStorage.getItem('studentName');
    let classroomEl = localStorage.getItem('classroom');
    
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

setName();