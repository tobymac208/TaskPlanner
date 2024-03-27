document.addEventListener("DOMContentLoaded", function() {
    const themeToggleButton = document.getElementById("theme-toggle");
    const addTaskButton = document.getElementById("add-task");
    const tasksContainer = document.getElementById("tasks");
    const taskDateInput = document.getElementById("task-date");
    const taskTimeInput = document.getElementById("task-time");
    const taskTextInput = document.getElementById("task-text");

    themeToggleButton.addEventListener("click", function() {
        if (document.body.getAttribute("data-theme") === "dark") {
            document.body.setAttribute("data-theme", "light");
        } else {
            document.body.setAttribute("data-theme", "dark");
        }
    });

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToDOM(task));
    }

    function addTaskToDOM(task) {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        if (task.completed) {
            taskElement.classList.add("completed");
        }
        taskElement.innerHTML = `<span>${task.date} ${task.time} - ${task.text}</span> <button class="delete">X</button>`;

        taskElement.querySelector("span").addEventListener("click", function() {
            task.completed = !task.completed;
            updateTaskInLocalStorage(task);
            taskElement.classList.toggle("completed");
        });

        taskElement.querySelector(".delete").addEventListener("click", function() {
            taskElement.remove();
            deleteTaskFromLocalStorage(task);
        });

        tasksContainer.appendChild(taskElement);
	        }

    function updateTaskInLocalStorage(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.findIndex(task => task.date === updatedTask.date && task.time === updatedTask.time && task.text === updatedTask.text);
        if (taskIndex > -1) {
            tasks[taskIndex] = updatedTask;
            saveTasksToLocalStorage(tasks);
        }
    }

    function deleteTaskFromLocalStorage(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.date !== taskToDelete.date || task.time !== taskToDelete.time || task.text !== taskToDelete.text);
        saveTasksToLocalStorage(tasks);
    }

    addTaskButton.addEventListener("click", function() {
        const date = taskDateInput.value;
        const time = taskTimeInput.value;
        const text = taskTextInput.value;

        if (date && time && text) {
            const task = { date, time, text, completed: false };
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.push(task);
            saveTasksToLocalStorage(tasks);
            addTaskToDOM(task);

            taskDateInput.value = '';
            taskTimeInput.value = '';
            taskTextInput.value = '';
        } else {
            alert("Please fill in all fields.");
        }
    });

    loadTasksFromLocalStorage();
});

