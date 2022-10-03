//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("click", filterTodo);

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var textField = document.getElementById("textInput");
var span = document.getElementsByClassName("close")[0];
var addBtn = document.getElementById("todo-button");

//Functions
function htmlEncode(str) {
  return String(str).replace(/[^\w. ]/gi, function(c){
    return '&#' + c.charCodeAt(0) + ';';
  });
}

function getItemFromLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
}

function addTodo(e) {
  //Prevent natural behavior
  e.preventDefault();
  const currentValue = htmlEncode(todoInput.value)?.trim() || ""
  if (!currentValue) {
    //alert("Fill the box");
    openmodal("red", "Please enter a Task!");
    return;
  }

  // alert("Duplicate task")
  if (isDuplicate(currentValue)) {
    openmodal('red', 'This Task is already added!');
    return;
  }


  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = currentValue;

  let newTodoItem = {
    id: Math.round(Math.random() * 100), //id for selection
    task: currentValue,
    status: "incomplete",
  };
  todoDiv.setAttribute("key", newTodoItem.id);

  //Save to local - do this last
  //Save to local
  saveLocalTodos(newTodoItem);
  //
  newTodo.classList.add("todo-item");
  newTodo.classList.add("todo")
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  const edit = document.createElement("div");
  edit.innerHTML =
    ` <form class="editform">
    <input type="text" placeholder=` +
    `"${newTodoItem.task}"` +
    `id="` +
    `edit-${newTodoItem.id}` +
    `" required />
    <div class="editDiv" style="margin:auto;">
    <button id="editBtn-` +
    `${newTodoItem.id}` +
    `" type="submit">
      <i class="fas fa-plus-square"></i>
    </button>
  </div>
  </form>`;
  edit.classList.add("hide");
  todoDiv.appendChild(edit);
  //Create Completed Button
  const completedButton = document.createElement("button");
  completedButton.innerHTML = `<i class="fas fa-check"></i>`;
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  //Create edit button
  const editButton = document.createElement("button");
  editButton.innerHTML = `<i class="fas fa-pen"></i>`;
  editButton.classList.add("edit-btn");
  editButton.addEventListener("click", () => editTodo(newTodoItem, todoDiv));
  todoDiv.appendChild(editButton);
  //Create trash button
  const trashButton = document.createElement("button");
  trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //attach final Todo
  todoList.appendChild(todoDiv);
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    const todo = item.parentElement;
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(todo);
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const status = "completed";
    const id = todo.getAttribute("key");
    saveStatus(id, status);
  }
}

//save the status of the task -> and persist by saving it to the localstorage
function saveStatus(id, status) {
  const todos = getItemFromLocalStorage();
  const intId = Number(id);
  const newTodo = todos.find((todo) => todo.id === intId);
  const newStatus =
    newTodo.status === "incomplete" ? "completed" : "incomplete";
  const todoIndex = todos.indexOf(newTodo);
  todos.splice(todoIndex, 1);
  newTodo.status = newStatus;
  todos.splice(todoIndex, 0, newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach((todo) => {
    // console.log(e.target.value);

    if (
      e.target.value === "completed" &&
      todo.classList.contains("completed")
    ) {
      todo.style.display = "flex";
    } else if (
      e.target.value === "completed" &&
      !todo.classList.contains("completed")
    ) {
      todo.style.display = "none";
    } else if (
      e.target.value === "incomplete" &&
      !todo.classList.contains("completed")
    ) {
      todo.style.display = "flex";
    } else if (
      e.target.value === "incomplete" &&
      !todo.classList.contains("incomplete")
    ) {
      todo.style.display = "none";
    } else {
      todo.style.display = "flex";
    }
  });
}

//save the task to the local storage
function saveLocalTodos(todo) {
  let todos = getItemFromLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//function to delete a task
function removeLocalTodos(id) {
  const intId = Number(id);
  let todos = getItemFromLocalStorage();
  const newTodo = todos.filter((todo) => todo.id !== intId);

  localStorage.setItem("todos", JSON.stringify(newTodo));
}

//function to toggle display
function editTodo(todo, todoDiv) {
  for (let i = 0; i < todoDiv.children.length; i++) {
    if (i == 1) {
      todoDiv.children[i].classList.remove("hide");
    } else {
      todoDiv.children[i].classList.add("hide");
    }
  }
  const editBtn = document.getElementById(`editBtn-` + `${todo.id}`);
  editBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    editTask(todo, todoDiv)
  });
}

function editTask(todo, todoDiv) {
  let todos = getItemFromLocalStorage();
  const editInputElem = document.getElementById(`edit-` + `${todo.id}`);
  const editValue = editInputElem.value?.trim() || "";
  if (!editValue) {
    //alert("Fill the box");
    openmodal("red", "Fill the box");
    return;
  }
  if (isDuplicate(editValue)) {
    openmodal('red', 'This Task is already added!');
    return;
  }
  const updatedTodos = todos.map((t) => {
    if (t.id === todo.id) {
      return { ...t, task: editValue }
    }
    return t;
  })
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
  todoDiv.children[0].innerText = editValue;
}

function isDuplicate(task) {
  let todos = getItemFromLocalStorage();
  const index = todos.findIndex(t => t.task === task)
  return index > -1
}

function getTodos() {
  let todos = getItemFromLocalStorage();
  todos.forEach(function (todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.status === "completed") {
      todoDiv.classList.add("completed");
    }
    todoDiv.setAttribute("key", todo.id);
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}
// function filterTodo(e) {
//   const todos = todoList.childNodes;
//   todos.forEach(function(todo) {
//     switch (e.target.value) {
//       case "all":
//         todo.style.display = "flex";
//         break;
//       case "completed":
//         if (todo.classList.contains("completed")) {
//           todo.style.display = "flex";
//         } else {
//           todo.style.display = "none";
//         }
//         break;
//       case "incomplete":
//         if (!todo.classList.contains("completed")) {
//           todo.style.display = "flex";
//         } else {
//           todo.style.display = "none";
//         }
//     }
//   });
// }

function saveLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function removeLocalTodos(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoIndex = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    //Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (todo.status == "completed") {
      todoDiv.classList.toggle("completed");
    }
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    todoInput.value = "";
    //input box
    const edit = document.createElement("div");
    edit.innerHTML =
      ` <form class="editform">
    <input type="text" placeholder=` +
      `"${todo.task}"` +
      `id="` +
      `edit-${todo.id}` +
      `" required />
    <div class="editDiv" style="margin:auto;">
    <button id="editBtn-` +
      `${todo.id}` +
      `" type="submit">
      <i class="fas fa-plus-square"></i>
    </button>
  </div>
  </form>`;
    edit.classList.add("hide");
    todoDiv.appendChild(edit);
    //Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Create edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fas fa-pen"></i>`;
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editTodo(todo, todoDiv));
    todoDiv.appendChild(editButton);
    //Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    trashButton.classList.add("trash-btn");
    todoDiv.setAttribute("key", todo.id);
    todoDiv.appendChild(trashButton);
    //attach final Todo
    todoList.appendChild(todoDiv);
  });
}

function deleteAll() {
  [...document.getElementsByClassName("todo")].map((n) => n && n.remove());
  localStorage.removeItem("todos");
  document.getElementById("confirmation_box").classList.add("hide");
}

function openmodal(color, message) {
  //pass color as either 'red' (for error), 'blue' for info and 'green' for success
  console.log("in");
  document.getElementById("content").classList.add(color);
  document.getElementById("modal-text").innerText = message;
  document.getElementById("Modal").classList.add("true");
}
function closemodal() {
  document.getElementById("Modal").classList.remove("true");
}

//changed the sequence as the old one was looking odd
setInterval(function () {
  var today = new Date();

  var hour = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();
  var time = hour + " : " + min + " : " + sec;
  document.getElementById("d1").innerHTML = time;

}, 100)
function show_alert() {
  if (localStorage.getItem("todos") === null) {
    let html = 'Please add items first';
    console.log(html);
    alert(html);
  }
  else {
    document.getElementById("confirmation_box").classList.remove("hide");
  }

}
function goback() {
  document.getElementById("confirmation_box").classList.add("hide");
}

btn.onclick = function() {
  modal.style.display = "block";
  textField.focus();
}

span.onclick = function() {
  modal.style.display = "none";
}
addBtn.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var day = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
document.getElementById("d2").innerHTML = day;
