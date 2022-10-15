function add_task(){
    var parent = document.getElementById("todo-container")[0];
    var child = parent.children[0];
    child.innerHTML += "Hello World";
}