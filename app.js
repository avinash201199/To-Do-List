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

//Functions
function getItemFromLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
}

function addTodo(e) {
  //Prevent natural behaviour
  e.preventDefault();
  if (todoInput.value === "") {
    alert("Fill the box");
    return;
  }
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;

  let newTodoItem = {
    id: Math.round(Math.random() * 100), //id for selection
    task: todoInput.value,
    status: "incomplete",
  };
  todoDiv.setAttribute("key", newTodoItem.id);

  //Save to local - do this last
  //Save to local
  saveLocalTodos(newTodoItem);
  //
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
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
}

function deleteTodo(e) {
  const item = e.target;
  const todo = item.parentElement;
  const id = todo.getAttribute("key");

  if (item.classList[0] === "trash-btn") {
    // e.target.parentElement.remove();
    todo.classList.add("fall");
    //at the end
    removeLocalTodos(id);
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  if (item.classList[0] === "complete-btn") {
    todo.classList.toggle("completed");
    let status = "";
    if (todo.classList.contains("completed")) {
      status = "completed";
    }
    console.log(id, status);
    saveStatus(id, status);
    console.log(todo);
  }
  //Prevent natural behaviour
  e.preventDefault();
  if (todoInput.value === "") {
    alert("Fill the box");
    return;
  }
  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  //Save to local - do this last
  //Save to local
  saveLocalTodos(todoInput.value);
  //
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
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
    console.log(todo);
  }
}

//save the status of the task -> and persist by saving it to the localstorage
function saveStatus(id, status) {
  const newStatus = status === "" ? "incomplete" : status;
  const intId = Number(id);
  const todos = getItemFromLocalStorage();
  const newTodo = todos.find((todo) => todo.id === intId);
  newTodo.status = newStatus;
  console.log(todos);
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
    //Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    todoInput.value = "";
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

function deleteAll(){
  [...document.getElementsByClassName("todo")].map(n => n && n.remove());
  localStorage.removeItem("todos");
}