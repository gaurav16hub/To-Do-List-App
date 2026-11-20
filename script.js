const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterTasks = document.getElementById("filterTasks");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// LOAD SAVED TASKS
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks = tasks.map(task => ({
    ...task,
    status: task.status || (task.completed ? "completed" : "todo")
}));

// SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
    category: taskCategory.value,
    priority: taskPriority.value,
    dueDate: taskDueDate.value,
    status:"todo"
});

    saveTasks();

    taskInput.value = "";

    displayTasks();
    updateSummary();
}

// DISPLAY TASKS
function displayTasks() {
    renderKanban();
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterTasks.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText);

        const matchesFilter =
            filterValue === "all" ||
            (filterValue === "completed" && task.completed) ||
            (filterValue === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {

        // CREATE LIST ITEM
        const li = document.createElement("li");

        // CREATE TASK TEXT
        const span = document.createElement("span");
        span.textContent = task.text;
         const details = document.createElement("small");

         details.textContent =
        `Category: ${task.category || "Other"} | ` +
        `Priority: ${task.priority || "Medium"} | ` +
        `Due: ${task.dueDate || "Not set"}`;

         details.className = "task-details";
        if (task.completed) {
            span.classList.add("completed");
        }

        // COMPLETE BUTTON
        const completeBtn = document.createElement("button");

        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.className = "complete-btn";

        completeBtn.onclick = () => {

            task.completed = !task.completed;

            saveTasks();
            displayTasks();
            updateSummary();
        };

        // EDIT BUTTON
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.onclick = function() {

            const editInput = document.createElement("input");

            editInput.type = "text";
            editInput.value = task.text;
            editInput.className = "edit-input";

            span.replaceWith(editInput);

            editBtn.textContent = "Save";

            editBtn.onclick = function() {

                const updatedText = editInput.value.trim();

                if (updatedText === "") {
                    alert("Task cannot be empty!");
                    return;
                }

                task.text = updatedText;

                saveTasks();
                displayTasks();
                updateSummary();
            };

        };

        // DELETE BUTTON
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.onclick = () => {

            if (confirm("Delete this task?")) {

                tasks = tasks.filter(t => t.id !== task.id);

                saveTasks();
                displayTasks();
                updateSummary();
            }
        };

        // APPEND ALL ELEMENTS
        li.append(
          span,
          details,
          completeBtn,
          editBtn,
          deleteBtn
        );

        taskList.appendChild(li);

    });
}

// UPDATE SUMMARY
function updateSummary() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

// ADD BUTTON EVENT
addTaskBtn.addEventListener("click", addTask);

// ENTER KEY EVENT
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

// SEARCH EVENT
searchInput.addEventListener("input", displayTasks);

// FILTER EVENT
filterTasks.addEventListener("change", displayTasks);
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
    }
});
function renderKanban() {
    const todoColumn = document.getElementById("todoColumn");
    const progressColumn = document.getElementById("progressColumn");
    const completedColumn = document.getElementById("completedColumn");

    todoColumn.innerHTML = "";
    progressColumn.innerHTML = "";
    completedColumn.innerHTML = "";

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "kanban-card";

        const title = document.createElement("h4");
        title.textContent = task.text;

        const details = document.createElement("small");
        details.textContent =
            `${task.category || "Other"} | ${task.priority || "Medium"}`;

        const statusSelect = document.createElement("select");

        statusSelect.innerHTML = `
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
        `;

        statusSelect.value = task.status || "todo";

        statusSelect.addEventListener("change", function () {
            task.status = this.value;
            task.completed = this.value === "completed";

            saveTasks();
            displayTasks();
            updateSummary();
        });

        card.append(title, details, statusSelect);

        if (task.status === "completed") {
            completedColumn.appendChild(card);
        } else if (task.status === "progress") {
            progressColumn.appendChild(card);
        } else {
            todoColumn.appendChild(card);
        }
    });
}
// INITIAL LOAD
displayTasks();
updateSummary();