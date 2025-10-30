// Select elements
const taskList = document.getElementById("taskList");
const addTaskModal = document.getElementById("addTaskModal");
const analysisModal = document.getElementById("analysisModal");
const openAddTaskBtn = document.getElementById("myBtn");
const closeAddTaskBtn = document.querySelector(".close-btn");
const closeAnalysisBtn = document.querySelector(".close-analysis");
const saveTaskBtn = document.getElementById("saveTask");
const analyzeBtn = document.getElementById("analyzeBtn");
const taskNameInput = document.getElementById("taskName");
const taskPriorityInput = document.getElementById("taskPriority");

let tasks = [];
let chartInstance = null;

// Opens the "Add Task" modal window
openAddTaskBtn.onclick = function () {
  addTaskModal.style.display = "block";
};

// Close Add Task Modal
closeAddTaskBtn.onclick = function () {
  addTaskModal.style.display = "none";
};

// Close Analysis Modal
closeAnalysisBtn.onclick = function () {
  analysisModal.style.display = "none";
};

// Add Task
saveTaskBtn.onclick = function () {
  const taskName = taskNameInput.value.trim();
  const taskPriority = taskPriorityInput.value;

  if (taskName === "") {
    alert("Please enter a task name!");
    return;
  }

  const task = {
    name: taskName,
    priority: taskPriority,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  addTaskModal.style.display = "none";
  taskNameInput.value = "";
};

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Task text with strike-through if completed
    const span = document.createElement("span");
    span.textContent = `${task.name} (${task.priority})`;
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }
    li.appendChild(span);

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Completed" : "Mark Complete";
    completeBtn.onclick = () => {
      tasks[index].completed = !tasks[index].completed; // Toggle completion
      renderTasks();
    };
    li.appendChild(completeBtn);

    taskList.appendChild(li);
  });
}

// Analyze Productivity
analyzeBtn.onclick = function () {
  analysisModal.style.display = "block";

  const highPriority = tasks.filter(
    (t) => t.priority === "High" && t.completed
  ).length;
  const mediumPriority = tasks.filter(
    (t) => t.priority === "Medium" && t.completed
  ).length;
  const lowPriority = tasks.filter(
    (t) => t.priority === "Low" && t.completed
  ).length;

  const ctx = document.getElementById("analysisChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["High", "Medium", "Low"],
      datasets: [
        {
          label: "Completed Tasks",
          data: [highPriority, mediumPriority, lowPriority],
          backgroundColor: ["#ff4d4d", "#ffcc00", "#66cc66"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  });
};
/* ==========================
   Delete All / Confirmation
   ==========================
   Functions:
     - show_alert()   : opens the "Are you sure?" modal
     - goback()       : closes the modal without deleting
     - deleteAll()    : removes all tasks from DOM + storage and resets UI
   Paste this at the end of your app.js (or in a new file loaded after app.js).
*/

// Show the confirmation box (used by your Delete All button: onclick="show_alert()")
function show_alert() {
  const confBox = document.getElementById("confirmation_box");
  if (confBox) {
    confBox.classList.remove("hide");
    confBox.style.display = "block";
    // focus yes button for accessibility if present
    const proceedBtn = confBox.querySelector(".proceed");
    if (proceedBtn) proceedBtn.focus();
    return;
  }

  // fallback: some pages also have a custom-confirm element
  const custom = document.getElementById("custom-confirm");
  if (custom) {
    custom.style.display = "block";
  } else {
    // ultimate fallback
    if (confirm("Are you sure you want to delete all tasks?")) deleteAll();
  }
}

// Close the confirmation box without deleting (used by onclick="goback()")
function goback() {
  const confBox = document.getElementById("confirmation_box");
  if (confBox) {
    confBox.classList.add("hide");
    confBox.style.display = "none";
  }

  const custom = document.getElementById("custom-confirm");
  if (custom) {
    custom.style.display = "none";
  }
}

// Delete all tasks: clear DOM, clear storage (per-user), reset counters + progress
function deleteAll() {
  // 1) Clear DOM tasks (your tasks live inside .todo-list)
  const todoList = document.querySelector(".todo-list");
  if (todoList) {
    // remove all child nodes
    todoList.innerHTML = "";
  } else {
    // fallback: if your tasks are in #taskList
    const altList = document.getElementById("taskList");
    if (altList) altList.innerHTML = "";
  }

  // 2) Clear localStorage for the current user (if you use getStorageKey)
  try {
    let storageKey = null;
    if (typeof getStorageKey === "function") {
      storageKey = getStorageKey();
      // if getStorageKey returned falsy, make a sensible fallback
      if (!storageKey) storageKey = `tasks_${localStorage.getItem("loggedInUser") || "default"}`;
    } else {
      // fallback key format used earlier in snippets
      const username = localStorage.getItem("loggedInUser") || "default";
      storageKey = `tasks_${username}`;
    }
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.warn("Could not remove tasks from localStorage:", err);
  }

  // 3) If you have a saveTasks function, call it to persist the cleared state (defensive)
  if (typeof saveTasks === "function") {
    try {
      saveTasks(); // should save the current (empty) DOM state
    } catch (err) {
      console.warn("saveTasks() threw an error:", err);
    }
  }

  // 4) Reset stats counters (state1, state2, state3) if present
  const state1 = document.getElementById("state1");
  const state2 = document.getElementById("state2");
  const state3 = document.getElementById("state3");
  if (state1) state1.textContent = "0";
  if (state2) state2.textContent = "0";
  if (state3) state3.textContent = "0";

  // 5) Reset progress bar
  const progressBar = document.getElementById("taskProgressBar");
  if (progressBar) {
    progressBar.style.width = "0%";
    progressBar.setAttribute("aria-valuenow", "0");
    progressBar.textContent = "0%";
  }

  // 6) Show empty message if present
  const emptyMessage = document.getElementById("emptyMessage");
  if (emptyMessage) {
    emptyMessage.style.display = "block";
  }

  // 7) Close confirmation UI(s)
  goback();

  // 8) If you have a function updateStats or updateEmptyMessage in global scope, call them
  if (typeof updateStats === "function") {
    try { updateStats(); } catch (err) { /* ignore */ }
  } else {
    // make sure any progress UI is still consistent
    if (typeof updateEmptyMessage === "function") {
      try { updateEmptyMessage(); } catch (err) { /* ignore */ }
    }
  }
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

// ---------- Optional: wire up confirm buttons if they exist on page ----------
(function attachConfirmListeners() {
  // confirmation_box proceed / cancel buttons (IDs or classes from your HTML)
  const proceed = document.querySelector(".confirmation_box .proceed") || document.getElementById("txt-color");
  const cancel = document.querySelector(".confirmation_box .donot_proceed") || document.getElementById("txt-color1");
  if (proceed) proceed.addEventListener("click", deleteAll);
  if (cancel) cancel.addEventListener("click", goback);

  // custom-confirm (another variant on your page)
  const customYes = document.getElementById("confirm-yes");
  const customNo = document.getElementById("confirm-no");
  if (customYes) customYes.addEventListener("click", function () {
    // hide the custom-confirm overlay first
    const custom = document.getElementById("custom-confirm");
    if (custom) custom.style.display = "none";
    deleteAll();
  });
  if (customNo) customNo.addEventListener("click", function () {
    const custom = document.getElementById("custom-confirm");
    if (custom) custom.style.display = "none";
  });

  // close icon on custom-confirm
  const customCancel = document.getElementById("confirm-cancel");
  if (customCancel) customCancel.addEventListener("click", function () {
    const custom = document.getElementById("custom-confirm");
    if (custom) custom.style.display = "none";
  });
})();
// Adds a new task to the list with selected priority and delete option
function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const priorityInput = document.getElementById("priorityInput").value;

  if (taskInput === '') {
    alert("Please enter a task");
    return;
  }

  const taskList = document.getElementById("taskList");

  // Create a new list item
  const li = document.createElement("li");

  // Add priority class
  if (priorityInput === "High") {
    li.classList.add("high-priority");
  } else if (priorityInput === "Medium") {
    li.classList.add("medium-priority");
  } else {
    li.classList.add("low-priority");
  }

  // Add task text with priority
  li.innerHTML = `${taskInput} <span>(${priorityInput})</span>`;

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => li.remove();
  li.appendChild(deleteBtn);

  // Append the task
  taskList.appendChild(li);

  // Reset inputs
  document.getElementById("taskInput").value = "";
  document.getElementById("priorityInput").value = "Low";
}

// ---------------- Manual Sorting ----------------
function sortTasks() {
  const sortBy = document.getElementById("sortBy").value;
  const taskList = document.querySelector(".todo-list");
  const tasks = Array.from(taskList.children);

  if (sortBy === "priority") {
    tasks.sort((a, b) => {
      const getPriorityValue = (task) => {
        const badge = task.querySelector(".badge");
        if (!badge) return 3; // default = Low
        const priority = badge.textContent.trim().toLowerCase();
        if (priority === "high") return 1;
        if (priority === "medium") return 2;
        return 3; // low
      };
      return getPriorityValue(a) - getPriorityValue(b);
    });
  }

  if (sortBy === "dueDate") {
    tasks.sort((a, b) => {
      const getDate = (task) => {
        const dateText =
          task.querySelector(".task-dates small")?.textContent || "";
        const parts = dateText.split("→");
        const due = parts[1] ? parts[1].trim().replace("Due: ", "") : "";
        return due && due !== "N/A"
          ? new Date(due)
          : new Date(8640000000000000); // max date if missing
      };
      return getDate(a) - getDate(b);
    });
  }

  // Re-append in sorted order
  taskList.innerHTML = "";
  tasks.forEach((task) => taskList.appendChild(task));
}
