
/* =====================================
   ACADEMIC PLANNER
===================================== */

const taskForm = document.getElementById("task-form");

if (taskForm) {
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    const taskList = document.getElementById("task-list");
    const taskMessage = document.getElementById("task-message");

    const totalTasks = document.getElementById("total-tasks");
    const completedTasks = document.getElementById("completed-tasks");
    const pendingTasks = document.getElementById("pending-tasks");

    let tasks = [];

    // Load saved tasks from the browser.
    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("studentAcademicTasks") || "[]"
        );

        if (
            Array.isArray(savedTasks) &&
            savedTasks.every(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean" &&
                typeof task.date === "string"
            )
        ) {
            tasks = savedTasks;
        }
    } catch (error) {
        tasks = [];
    }

    // Save tasks to local storage.
    function saveTasks() {
        try {
            localStorage.setItem(
                "studentAcademicTasks",
                JSON.stringify(tasks)
            );
            return true;
        } catch (error) {
            taskMessage.textContent =
                "Unable to save tasks in this browser.";
            taskMessage.className = "message error";
            return false;
        }
    }

    // Update task totals.
    function updateStatistics() {
        const completed = tasks.filter(
            task => task.completed
        ).length;

        totalTasks.textContent = tasks.length;
        completedTasks.textContent = completed;
        pendingTasks.textContent = tasks.length - completed;
    }

    // Display all tasks on the page.
    function renderTasks() {
        taskList.replaceChildren();

        if (tasks.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent =
                "No tasks yet. Add your first academic task!";
            taskList.appendChild(emptyMessage);
        }

        tasks.forEach(function (task) {
            const item = document.createElement("li");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                "Mark " + task.text + " as completed"
            );

            checkbox.addEventListener("change", function () {
                const previous = task.completed;
                task.completed = checkbox.checked;

                if (!saveTasks()) {
                    task.completed = previous;
                }

                renderTasks();
            });

            const details = document.createElement("div");
            details.className = "task-text";

            const taskName = document.createElement("span");
            taskName.textContent = task.text;
            details.appendChild(taskName);

            if (task.date) {
                const dateLabel = document.createElement("small");
                dateLabel.textContent = " — Due: " + task.date;
                details.appendChild(dateLabel);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute(
                "aria-label",
                "Delete " + task.text
            );

            deleteButton.addEventListener("click", function () {
                const previousTasks = [...tasks];

                tasks = tasks.filter(
                    currentTask => currentTask.id !== task.id
                );

                if (!saveTasks()) {
                    tasks = previousTasks;
                }

                renderTasks();
            });

            item.append(checkbox, details, deleteButton);
            taskList.appendChild(item);
        });

        updateStatistics();
    }

    // Add a new academic task.
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const text = taskInput.value.trim();
        const date = taskDate.value;

        if (!text) {
            taskMessage.textContent =
                "Please enter a task description.";
            taskMessage.className = "message error";
            return;
        }

        const newTask = {
            id: crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString() +
                  Math.random().toString(36).slice(2),
            text: text,
            date: date,
            completed: false
        };

        tasks.push(newTask);

        if (!saveTasks()) {
            tasks.pop();
            return;
        }

        taskForm.reset();
        taskMessage.textContent = "Task added successfully!";
        taskMessage.className = "message success";

        renderTasks();
        taskInput.focus();
    });

    // Display saved tasks when the page opens.
    renderTasks();
}


/* =====================================
   CONTACT FORM VALIDATION
===================================== */

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const feedback = document.getElementById("contact-feedback");

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const message = messageInput.value.trim();

        // Check for empty fields.
        if (!name || !email || !phone || !message) {
            showFeedback(
                "Error: Please fill in every field.",
                false
            );
            return;
        }

        // Validate email format.
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFeedback(
                "Error: Please enter a valid email address.",
                false
            );
            emailInput.focus();
            return;
        }

        // Ensure the phone contains digits only.
        if (!/^[0-9]+$/.test(phone)) {
            showFeedback(
                "Error: Phone number must contain digits only.",
                false
            );
            phoneInput.focus();
            return;
        }

        showFeedback(
            "Validation successful! Your form is valid, " +
            "but this demonstration does not send messages.",
            true
        );
    });

    function showFeedback(message, success) {
        feedback.textContent = message;
        feedback.className = success
            ? "message success"
            : "message error";
    }
}
