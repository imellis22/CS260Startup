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

setName();