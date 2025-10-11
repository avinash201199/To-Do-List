// Add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput").value.trim();
  const priorityInput = document.getElementById("priorityInput").value;

  if (taskInput === "") {
    alert("Please enter a task");
    return;
  }

  const taskList = document.getElementById("taskList");

  // Create a new list item
  const li = document.createElement("li");
  li.classList.add("task-item");

  // Add priority class
  if (priorityInput === "High") {
    li.classList.add("high-priority");
  } else if (priorityInput === "Medium") {
    li.classList.add("medium-priority");
  } else {
    li.classList.add("low-priority");
  }

  // Add task text
  const taskText = document.createElement("span");
  taskText.textContent = taskInput;
  li.appendChild(taskText);

  // Add priority badge
  const priorityBadge = document.createElement("span");
  priorityBadge.className = "priority-badge";
  priorityBadge.textContent = `(${priorityInput})`;
  li.appendChild(priorityBadge);

  // Add stage badge
  const stageBadge = document.createElement("span");
  stageBadge.className = "stage-badge pending-stage";
  stageBadge.textContent = "Pending";
  li.appendChild(stageBadge);

  // Add edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editTask(li);
  li.appendChild(editBtn);

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => li.remove();
  li.appendChild(deleteBtn);

  // Append task
  taskList.appendChild(li);

  // Reset inputs
  document.getElementById("taskInput").value = "";
  document.getElementById("priorityInput").value = "Low";
}

// Edit task (update stage)
function editTask(taskElement) {
  const stageOptions = ["Pending", "In Progress", "Completed"];
  const currentStage = taskElement.querySelector(".stage-badge").textContent;

  // Create and show the edit modal
  const modal = document.createElement("div");
  modal.className = "edit-modal";
  modal.innerHTML = `
    <div class="edit-modal-content">
      <h4>Update Task Stage</h4>
      <select class="stage-select">
        ${stageOptions
          .map(
            (stage) => `
          <option value="${stage.toLowerCase()}" ${
              stage === currentStage ? "selected" : ""
            }>
            ${stage}
          </option>
        `
          )
          .join("")}
      </select>
      <div class="edit-modal-buttons">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle save button click
  modal.querySelector(".save-btn").addEventListener("click", () => {
    const newStage = modal.querySelector(".stage-select").value;
    updateTaskStage(taskElement, newStage);
    modal.remove();
  });

  // Handle cancel button click
  modal.querySelector(".cancel-btn").addEventListener("click", () => {
    modal.remove();
  });
}

// Update stage badge
function updateTaskStage(taskElement, newStage) {
  const stageBadge = taskElement.querySelector(".stage-badge");

  // Remove old stage class
  stageBadge.classList.forEach((className) => {
    if (className.endsWith("-stage")) {
      stageBadge.classList.remove(className);
    }
  });

  // Add new stage class
  stageBadge.classList.add(`${newStage}-stage`);
  stageBadge.textContent =
    newStage.charAt(0).toUpperCase() + newStage.slice(1);
}
