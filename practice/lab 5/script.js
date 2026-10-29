const STORAGE_KEY = "my_todo_tasks";

let tasks = [];

const sideDrawer = document.getElementById("sideDrawer");
const menuOverlay = document.getElementById("menuOverlay");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyState = document.getElementById("emptyState");

function toggleMenu() {
  const isOpen = sideDrawer.classList.contains("open");
  if (isOpen) {
    closeMenu();
  } else {
    sideDrawer.classList.add("open");
    menuOverlay.classList.add("open");
    document.body.classList.add("menu-open");
  }
}

function closeMenu() {
  sideDrawer.classList.remove("open");
  menuOverlay.classList.remove("open");
  document.body.classList.remove("menu-open");
}

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

function handleEnter(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const remainingCount = tasks.filter(t => !t.completed).length;
  if (remainingCount === 1) {
    taskCounter.textContent = "1 task remaining";
  } else {
    taskCounter.textContent = `${remainingCount} tasks remaining`;
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;

      li.innerHTML = `
        <div class="task-item-left">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? "checked" : ""} 
            onchange="toggleTask(${task.id})"
            aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
          >
          <span 
            class="task-text" 
            onclick="toggleTask(${task.id})"
            title="Click to toggle"
          >${escapeHtml(task.text)}</span>
        </div>
        <button 
          class="btn-delete" 
          onclick="deleteTask(${task.id})" 
          aria-label="Delete task: ${escapeHtml(task.text)}"
          title="Delete task"
        >&times;</button>
      `;

      taskList.appendChild(li);
    });
  }

  updateCounter();
}

function escapeHtml(unsafeText) {
  return unsafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to localStorage:", e);
  }
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      tasks = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse tasks from localStorage:", e);
    tasks = [];
  }
  renderTasks();
}

loadTasks();
