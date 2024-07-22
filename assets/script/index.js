function getUser(){
    let userName = $('#name').val();
    if(userName==""){
        alert("Please Enter Your Name");
    }else{
        localStorage.setItem('lastUserName', userName);
        window.location.href = window.location.href.replace("/index.html","")+"/quiz.html";
    }
}