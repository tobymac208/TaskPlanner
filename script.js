class TaskManager {
    constructor() {
        this.tasks = []; // Initialize tasks as an array
        this.initialize();
    }

    initialize() {
        this.loadTasks();
        this.bindUIActions();
    }

    bindUIActions() {
        document.getElementById("theme-toggle").addEventListener("click", () => this.toggleTheme());
        document.getElementById("add-task").addEventListener("click", () => this.addNewTask());
    }

    loadTasks() {
        const tasksFromStorage = JSON.parse(localStorage.getItem("tasks"));
        // Ensure the loaded data is an array before assigning it to this.tasks
        if (Array.isArray(tasksFromStorage)) {
            this.tasks = tasksFromStorage;
        } else {
            console.error("Loaded tasks is not an array.", tasksFromStorage);
        }
        this.tasks.forEach(task => this.renderTask(task));
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    addNewTask() {
        const date = document.getElementById("task-date").value;
        const time = document.getElementById("task-time").value;
        const text = document.getElementById("task-text").value;

        if (date && time && text) {
            const task = { date, time, text, completed: false };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTask(task);

            // Clear input fields after adding a task
            document.getElementById("task-date").value = '';
            document.getElementById("task-time").value = '';
            document.getElementById("task-text").value = '';
        } else {
            alert("Please fill in all the details for the task.");
        }
    }

    renderTask(task) {
        const taskContainer = document.createElement("div");
        taskContainer.className = `task${task.completed ? " completed" : ""}`;
        taskContainer.innerHTML = `
            <span>${task.date} ${task.time} - ${task.text}</span>
            <button class="delete">X</button>
        `;

        taskContainer.querySelector("span").addEventListener("click", () => this.toggleTaskCompletion(task));
        taskContainer.querySelector(".delete").addEventListener("click", (e) => this.deleteTask(e, task));

        document.getElementById("tasks").appendChild(taskContainer);
    }

    toggleTaskCompletion(task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.refreshTasks();
    }

    deleteTask(event, taskToDelete) {
        event.target.parentElement.remove();
        this.tasks = this.tasks.filter(task => task !== taskToDelete);
        this.saveTasks();
    }

    refreshTasks() {
        const tasksElement = document.getElementById("tasks");
        tasksElement.innerHTML = ''; // Clear current tasks
        this.loadTasks(); // Reload and re-render tasks
    }

    toggleTheme() {
        const body = document.body;
        body.setAttribute("data-theme", body.getAttribute("data-theme") === "dark" ? "light" : "dark");
    }
}

document.addEventListener("DOMContentLoaded", () => new TaskManager());

