const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const deletedList = document.getElementById("deleted-tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== "") {
    const task = { text: taskText, createdAt: new Date(), completed: false };
    tasks.push(task);
    updateLocalStorage();
    renderTasks();
    input.value = "";
  }
});

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      updateLocalStorage();
      renderTasks();
    });

    const container = document.createElement("div");
    container.classList.add("task-content");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener("blur", () => {
      task.text = span.textContent.trim();
      updateLocalStorage();
    });

    const date = document.createElement("small");
    date.classList.add("task-date");
    date.textContent = formatDate(task.createdAt);

    container.appendChild(span);
    container.appendChild(date);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      deletedTasks.push(task);
      updateLocalStorage();
      renderTasks();
      renderDeletedTasks();
    });

    const actions = document.createElement("div");
    actions.classList.add("actions");
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(container);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function renderDeletedTasks() {
  deletedList.innerHTML = "";
  deletedTasks.forEach(task => {
    const deletedLi = document.createElement("li");

    const container = document.createElement("div");
    container.classList.add("task-content");

    const span = document.createElement("span");
    span.textContent = task.text;

    const date = document.createElement("small");
    date.classList.add("task-date");
    date.textContent = formatDate(task.createdAt);

    container.appendChild(span);
    container.appendChild(date);

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "↩️";
    restoreBtn.title = "Restore";
    restoreBtn.addEventListener("click", () => {
      deletedTasks = deletedTasks.filter(t => t !== task);
      tasks.push(task);
      updateLocalStorage();
      renderTasks();
      renderDeletedTasks();
    });

    const permDeleteBtn = document.createElement("button");
    permDeleteBtn.textContent = "❌";
    permDeleteBtn.title = "Delete permanently";
    permDeleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task permanently?")) {
        deletedTasks = deletedTasks.filter(t => t !== task);
        updateLocalStorage();
        renderDeletedTasks();
      }
    });

    const actions = document.createElement("div");
    actions.classList.add("actions");
    actions.appendChild(restoreBtn);
    actions.appendChild(permDeleteBtn);

    deletedLi.appendChild(container);
    deletedLi.appendChild(actions);
    deletedList.appendChild(deletedLi);
  });
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString('default', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

renderTasks();
renderDeletedTasks();