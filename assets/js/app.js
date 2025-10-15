//Select DOM
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const deleteAllButton = document.querySelector(".delete-all");
const noToDoItemText = document.querySelector(".no-to-do-item");

//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteTodo);
filterOption.addEventListener("change", filterTodo);

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var textField = document.getElementById("textInput");
var span = document.getElementsByClassName("close")[0];
var addBtn = document.getElementById("todo-button");
//Functions
function checkForEmptyList() {
  if (localStorage.getItem("todos") === null) {
    deleteAllButton.classList.add("hide");
    noToDoItemText.classList.remove("hide");
  } else {
    if (getItemFromLocalStorage().length == 0) {
      deleteAllButton.classList.add("hide");
      noToDoItemText.classList.remove("hide");
    } else {
      deleteAllButton.classList.remove("hide");
      noToDoItemText.classList.add("hide");
    }
  }
}
setInterval(checkForEmptyList, 100);

function htmlEncode(str) {
  return String(str);
}

function getItemFromLocalStorage() {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
}

function addTodo(e) {
  //Prevent natural behavior
  e.preventDefault();

  const d = new Date();
  const createTime = d.getTime();
  const infoText = `The todo item was created at ${createTime}, ${day}`;
  const currentValue = htmlEncode(todoInput.value)?.trim() || "";
  const categoryValue = document.getElementById("categorySelect").value;
  const priorityValue = document.getElementById("priorityInput").value;
  const timerValue = parseInt(document.getElementById("timerPreset").value) || 0;
  
  if (!currentValue) {
    //alert("Fill the box");
    openmodal("red", "Please enter a Task!");
    return;
  }
  //alert("Only Number is Type");
  if (!/\D/.test(currentValue) == true) {
    openmodal("red", "Do not enter only Numbers, Please enter a valid Task!");
    return;
  }

  // alert("Duplicate task")
  if (isDuplicate(currentValue)) {
    openmodal("red", "This Task is already added!");
    return;
  }

  //Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.classList.add(`priority-${priorityValue.toLowerCase()}`);
  todoDiv.classList.add(`category-${categoryValue}`);
  
  //Create list
  const newTodo = document.createElement("li");
  newTodo.innerHTML = `
    <div class="task-content">
      <span class="task-text">${currentValue}</span>
      <div class="task-meta">
        <span class="task-priority priority-${priorityValue.toLowerCase()}">${priorityValue}</span>
        <span class="task-category">${categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1)}</span>
        ${timerValue > 0 ? `<span class="task-timer">⏱️ ${timerValue} min</span>` : ''}
      </div>
    </div>
  `;

  let newTodoItem = {
    id: Math.round(Math.random() * 100000), //id for selection - increased range to avoid duplicates
    task: currentValue,
    category: categoryValue,
    priority: priorityValue,
    timerDuration: timerValue * 60, // Convert minutes to seconds
    timeSpent: 0,
    isTimerRunning: false,
    status: "incomplete",
    infoText: infoText,
    createTime: createTime,
  };
  todoDiv.setAttribute("key", newTodoItem.id);

  //Save to local - do this last
  //Save to local
  saveLocalTodos(newTodoItem);

  //
  newTodo.classList.add("todo-item");
  newTodo.classList.add("todo");
  todoDiv.appendChild(newTodo);
  todoInput.value = "";
  
  // Clear form inputs
  document.getElementById("categorySelect").value = "work";
  document.getElementById("priorityInput").value = "Low";
  document.getElementById("timerPreset").value = "0";
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
  //Create timer button (if timer is set)
  if (timerValue > 0) {
    const timerButton = document.createElement("button");
    timerButton.innerHTML = `<i class="fas fa-play"></i>`;
    timerButton.classList.add("timer-btn");
    timerButton.title = "Start Timer";
    timerButton.addEventListener("click", () => toggleTimer(newTodoItem, todoDiv, timerButton));
    todoDiv.appendChild(timerButton);
  }
  
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
  //Create info button
  const infoButton = document.createElement("span");
  infoButton.innerHTML = `<i class="fas fa-info-circle"></i>`;
  infoButton.classList.add("edit-btn");
  todoDiv.appendChild(infoButton);

  //attach final Todo
  todoList.appendChild(todoDiv);

  if (localStorage.getItem("display-theme") == "dark") {
    document.querySelectorAll(".todo");
    todoDiv.classList.toggle("dark-mode");
    newTodo.classList.toggle("dark-mode");
  }
  setAggregatedToDos();
}

function deleteTodo(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    e.preventDefault();
    const confirmationBox = document.getElementById("custom-confirm");
    const confirmYesButton = document.getElementById("confirm-yes");
    const confirmNoButton = document.getElementById("confirm-no");
    const confirmCancelButton = document.getElementById("confirm-cancel");
    const todo = item.parentElement;

    const handleYesClick = () => {
      const todoId = todo.getAttribute("key");
      confirmationBox.style.display = "none";
      todo.classList.add("fall");
      removeLocalTodos(todoId);
      todo.addEventListener("transitionend", () => {
        todo.remove();
      });
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
      Toastify({
        text: "Task deleted successfully 🗑️",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();
      
    };

    const handleNoClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleCancelClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    confirmYesButton.addEventListener("click", handleYesClick);
    confirmNoButton.addEventListener("click", handleNoClick);
    confirmCancelButton.addEventListener("click", handleCancelClick);

    confirmationBox.style.display = "block";
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
    const status = "completed";
    const id = todo.getAttribute("key");
    saveStatus(id, status);
    checkIfAllTaksCompleted();
  }

  setAggregatedToDos();
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
    editTask(todo, todoDiv);
    location.reload();
  });
}

const myModal = document.getElementById("myModal");
  const closeBtn = myModal.querySelector(".close");

  // Function to open modal
  function openMyModal() {
    myModal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  // Function to close modal
  function closeMyModal() {
    myModal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  // Close modal when clicking on the "×" button
  closeBtn.addEventListener("click", closeMyModal);

  // Optional: close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if (e.target === myModal) {
      closeMyModal();
    }
  });


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
    openmodal("red", "This Task is already added!");
    return;
  }
  const updatedTodos = todos.map((t) => {
    if (t.id === todo.id) {
      return { ...t, task: editValue };
    }
    return t;
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
  todoDiv.children[0].innerText = editValue;
}

function isDuplicate(task) {
  let todos = getItemFromLocalStorage();
  const index = todos.findIndex((t) => t.task === task);
  return index > -1;
}

// function getTodos() {
//   let todos = getItemFromLocalStorage();
//   todos.forEach(function (todo) {

//     //Create todo div
//     const todoDiv = document.createElement("div");
//     todoDiv.classList.add("todo");
//     if (todo.status === "completed") {
//       todoDiv.classList.add("completed");
//     }
//     todoDiv.setAttribute("key", todo.id);
//     //Create list
//     const newTodo = document.createElement("li");
//     newTodo.innerText = todo.task;
//     newTodo.classList.add("todo-item");
//     todoDiv.appendChild(newTodo);
//     //Create Completed Button
//     const completedButton = document.createElement("button");
//     completedButton.innerHTML = `<i class="fas fa-check"></i>`;
//     completedButton.classList.add("complete-btn");
//     todoDiv.appendChild(completedButton);
//     //Create trash button
//     const trashButton = document.createElement("button");
//     trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
//     trashButton.classList.add("trash-btn");
//     todoDiv.appendChild(trashButton);
//     //attach final Todo
//     todoList.appendChild(todoDiv);
//   });
// }
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

function checkIfAllTaksCompleted() {
  let todos = getItemFromLocalStorage();
  let counter = 0;
  let totalItems = todos.length;
  todos.forEach((todo) => {
    if (todo.status == "completed") {
      counter++;
    }
  });
  if (counter == totalItems && totalItems > 0) {
    setAggregatedToDos();
    document.getElementById("congratulations_box").classList.remove("hide");
  }
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
    if (todo.priority) todoDiv.classList.add(`priority-${todo.priority.toLowerCase()}`);
    if (todo.category) todoDiv.classList.add(`category-${todo.category}`);
    if (todo.status == "completed") {
      todoDiv.classList.toggle("completed");
    }
    //Create list with enhanced display
    const newTodo = document.createElement("li");
    const priority = todo.priority || 'Low';
    const category = todo.category || 'personal';
    const timerDuration = todo.timerDuration || 0;
    
    newTodo.innerHTML = `
      <div class="task-content">
        <span class="task-text">${todo.task}</span>
        <div class="task-meta">
          <span class="task-priority priority-${priority.toLowerCase()}">${priority}</span>
          <span class="task-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
          ${timerDuration > 0 ? `<span class="task-timer">⏱️ ${Math.floor(timerDuration / 60)} min</span>` : ''}
          ${todo.timeSpent > 0 ? `<span class="time-spent">⏰ ${Math.floor(todo.timeSpent / 60)}m spent</span>` : ''}
        </div>
      </div>
    `;
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
    
    //Create timer button (if timer is set)
    if (todo.timerDuration > 0) {
      const timerButton = document.createElement("button");
      timerButton.innerHTML = todo.isTimerRunning ? `<i class="fas fa-pause"></i>` : `<i class="fas fa-play"></i>`;
      timerButton.classList.add("timer-btn");
      timerButton.title = todo.isTimerRunning ? "Pause Timer" : "Start Timer";
      timerButton.addEventListener("click", () => toggleTimer(todo, todoDiv, timerButton));
      todoDiv.appendChild(timerButton);
    }
    
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
    //Create info button
    if (!todo.infoText) todo.infoText = "Create time not found.";
    const infoButton = document.createElement("span");
    infoButton.innerHTML = `<i class="fas fa-info-circle"></i>`;
    infoButton.classList.add("edit-btn");
    todoDiv.appendChild(infoButton);
    infoButton.addEventListener("click", () => {
      const time = new Date(todo.createTime);
      const timeSpentMsg = todo.timeSpent > 0 ? `\nTime spent: ${Math.floor(todo.timeSpent / 60)} minutes` : '';
      alert(`The todo item was created at ${time.toString().slice(0, 24)}${timeSpentMsg}`);
    });
    //attach final Todo
    todoList.appendChild(todoDiv);
    if (localStorage.getItem("display-theme") == "dark") {
      todoDiv.classList.toggle("dark-mode");
    }
  });

  setAggregatedToDos();
}

function deleteAll() {
  [...document.getElementsByClassName("todo")].map((n) => n && n.remove());
  localStorage.removeItem("todos");
  document.getElementById("confirmation_box").classList.add("hide");
  Toastify({
    text: "All tasks deleted successfully 🗑️",
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: "#f44336",
  }).showToast();
  setAggregatedToDos();
}

function openmodal(color, message, timer = 3000) {
  //pass color as either 'red' (for error), 'blue' for info and 'green' for success
  document.getElementById("content").classList.add(color);
  document.getElementById("modal-text").innerText = message;
  document.getElementById("Modal").classList.add("true");
  setTimeout(closemodal, timer);
}
function closemodal() {
  document.getElementById("Modal").classList.remove("true");
}

/* Clock JS modification  */
(function () {
  setInterval(() => {
    var time = new Date().toLocaleTimeString();
    var date = new Date().toLocaleDateString();
    var day = new Date().getDay();
    switch (day) {
      case 0:
        day = "Sunday,";
        break;
      case 1:
        day = "Monday,";
        break;
      case 2:
        day = "Tuesday,";
        break;
      case 3:
        day = "Wednesday,";
        break;
      case 4:
        day = "Thursday,";
        break;
      case 5:
        day = "Friday,";
        break;
      case 6:
        day = "Saturday,";
        break;
    }
    document.getElementById("time").innerHTML = time;
    document.getElementById("date").innerHTML = date;
    document.getElementById("day").innerHTML = day;
  }, 1000);
})();

/* ################################### */

function show_alert() {
  if (localStorage.getItem("todos") === null) {
    let html = "Please add items first";
    console.log({ html });
    alert(html);
  } else {
    document.getElementById("confirmation_box").classList.remove("hide");
  }
}
function goback() {
  document.getElementById("confirmation_box").classList.add("hide");
  document.getElementById("congratulations_box").classList.add("hide");
}

//function to toggle darkmode
function switchToDarkMode() {
  var elem1 = document.querySelector(".navbar");
  var elem2 = document.querySelector(".header h1");
  var elem3 = document.querySelector(".footer");
  var elem4 = document.querySelectorAll(".footerelements");
  var elem5 = document.querySelector(".Clock");
  var elem6 = document.querySelectorAll(".todo");
  var elem7 = document.body;
  var elem8 = document.querySelector(".modal-content");
  var elem9 = document.getElementById("textInput");

  elem1.classList.toggle("dark-mode");
  elem2.classList.toggle("dark-mode");
  elem3.classList.toggle("dark-mode");
  elem5.classList.toggle("dark-mode");
  for (var i = 0; i < elem4.length; i++) {
    elem4[i].classList.toggle("dark-mode");
  }
  for (var i = 0; i < elem6.length; i++) {
    elem6[i].classList.toggle("dark-mode");
  }
  elem7.classList.toggle("body-background");

  if (elem1.className == "navbar dark-mode") {
    localStorage.setItem("display-theme", "dark");
  } else {
    localStorage.setItem("display-theme", "light");
  }

  elem8.classList.toggle("dark-mode");
  elem9.classList.toggle("dark-mode");
}
//Function to check current Theme of webpage
function checkTheme() {
  if (localStorage.getItem("display-theme") == "dark") {
    document.querySelector(".checkbox").checked = true;
    switchToDarkMode();
  }
}
checkTheme();

btn.onclick = function () {
  modal.style.display = "block";
  textField.focus();
  // checkTheme();
};

span.onclick = function () {
  modal.style.display = "none";
};
addBtn.onclick = function () {
  modal.style.display = "none";
  // Clear form inputs when modal closes
  document.getElementById("textInput").value = "";
  document.getElementById("categorySelect").value = "work";
  document.getElementById("priorityInput").value = "Low";
  document.getElementById("timerPreset").value = "0";

  Toastify({
    text: "Task added successfully ✅",
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: "#4CAF50",
  }).showToast();
  
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function setAggregatedToDos() {
  let todos;
  let totalCompletedTask = 0;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const totalTask = todos.length;

  todos.forEach(function (todo) {
    if (todo.status == "completed") {
      totalCompletedTask += 1;
    }
  });

  const elemTotalTask = document.getElementById("state1");
  const elemRemainingTask = document.getElementById("state2");
  const elemCompletedTask = document.getElementById("state3");
  elemTotalTask.textContent = totalTask;
  elemRemainingTask.textContent = totalTask - totalCompletedTask;
  elemCompletedTask.textContent = totalCompletedTask;
}

// Timer Management System
let activeTimers = {};

function toggleTimer(todoItem, todoDiv, timerButton) {
  const todoId = todoItem.id;
  
  if (todoItem.isTimerRunning) {
    // Stop timer
    pauseTimer(todoId);
    timerButton.innerHTML = `<i class="fas fa-play"></i>`;
    timerButton.title = "Start Timer";
    todoItem.isTimerRunning = false;
  } else {
    // Start timer
    startTimer(todoId, todoItem, todoDiv, timerButton);
    timerButton.innerHTML = `<i class="fas fa-pause"></i>`;
    timerButton.title = "Pause Timer";
    todoItem.isTimerRunning = true;
  }
  
  // Update localStorage
  updateTodoInStorage(todoItem);
}

function startTimer(todoId, todoItem, todoDiv, timerButton) {
  if (activeTimers[todoId]) {
    clearInterval(activeTimers[todoId]);
  }
  
  let remainingTime = todoItem.timerDuration - (todoItem.timeSpent || 0);
  
  activeTimers[todoId] = setInterval(() => {
    todoItem.timeSpent = (todoItem.timeSpent || 0) + 1;
    remainingTime--;
    
    // Update UI to show remaining time
    updateTimerDisplay(todoDiv, remainingTime);
    
    // Update localStorage every 10 seconds to persist progress
    if (todoItem.timeSpent % 10 === 0) {
      updateTodoInStorage(todoItem);
    }
    
    // Timer completed
    if (remainingTime <= 0) {
      clearInterval(activeTimers[todoId]);
      delete activeTimers[todoId];
      
      todoItem.isTimerRunning = false;
      timerButton.innerHTML = `<i class="fas fa-check-circle"></i>`;
      timerButton.title = "Timer Completed!";
      timerButton.disabled = true;
      
      // Show completion notification
      showTimerCompletedNotification(todoItem.task);
      
      // Update storage
      updateTodoInStorage(todoItem);
      
      // Update time display
      updateTimerDisplay(todoDiv, 0);
    }
  }, 1000);
}

function pauseTimer(todoId) {
  if (activeTimers[todoId]) {
    clearInterval(activeTimers[todoId]);
    delete activeTimers[todoId];
  }
}

function updateTimerDisplay(todoDiv, remainingSeconds) {
  const timerDisplay = todoDiv.querySelector('.timer-display') || createTimerDisplay(todoDiv);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function createTimerDisplay(todoDiv) {
  const timerDisplay = document.createElement('span');
  timerDisplay.classList.add('timer-display');
  const taskContent = todoDiv.querySelector('.task-content');
  if (taskContent) {
    taskContent.appendChild(timerDisplay);
  }
  return timerDisplay;
}

function showTimerCompletedNotification(taskName) {
  openmodal("green", `Timer completed for "${taskName}"! Great job! 🎉`, 5000);
  
  // Play notification sound if available
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaHwNLv+juxG');
    audio.play().catch(() => {}); // Ignore errors if audio can't play
  } catch (e) {}
}

function updateTodoInStorage(todoItem) {
  let todos = getItemFromLocalStorage();
  const todoIndex = todos.findIndex(t => t.id === todoItem.id);
  if (todoIndex !== -1) {
    todos[todoIndex] = todoItem;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}
