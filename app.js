/**
 * DOM Explorer Assignment Solution
 * Vanilla JavaScript implementation demonstrating DOM APIs, Propagation, and Attributes vs Properties
 */
document.addEventListener("DOMContentLoaded", () => {
    // ---- DOM Elements Selectors ----
    const taskForm = document.getElementById("task-form");
    const taskTitleInput = document.getElementById("task-title");
    const taskCategorySelect = document.getElementById("task-category");
    const taskContainer = document.getElementById("task-container");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const pendingCountSpan = document.getElementById("pending-count");
    const completedCountSpan = document.getElementById("completed-count");
    const clearAllBtn = document.getElementById("clear-all-btn");

    // Initialize state array from LocalStorage
    let tasksCollection = JSON.parse(localStorage.getItem("tasks")) || [];

    // ---- 2️⃣ Attributes vs Properties Demonstration ----
    /**
     * EXPLANATION:
     * - HTML Attributes: Defined directly inside the HTML markup text. They represent the *initial state* configuration.
     * Using `input.getAttribute('value')` checks the original state written in the DOM code string.
     * - DOM Properties: Exist live inside the active browser memory object hierarchy. They represent the *current dynamic live state*.
     * Using `input.value` reads the text exactly as typed by a user interactively.
     */
    taskTitleInput.addEventListener("input", (e) => {
        console.log("--- Attributes vs Properties Live Analysis ---");
        console.log("Live Property (input.value):", e.target.value);
        console.log("Static Attribute (input.getAttribute('value')):", e.target.getAttribute("value"));
    });


    // ---- 1️⃣ & 3️⃣ DOM Manipulation & Task Creation Module ----
    function renderTasks() {
        // Clear current inner structure
        taskContainer.innerHTML = "";

        // Using a DocumentFragment to optimize pipeline layout rendering efficiency
        const frag = document.createDocumentFragment();

        tasksCollection.forEach(task => {
            // Create root container card node dynamically
            const card = document.createElement("div");
            card.classList.add("task-card");
            
            // Set required custom data attributes via dataset property
            card.dataset.id = task.id;
            card.dataset.status = task.status;
            card.dataset.category = task.category;

            // Generate content subnodes cleanly with text verification
            const contentInfo = document.createElement("div");
            const headingText = document.createElement("span");
            headingText.classList.add("category-badge");
            headingText.style.fontWeight = "bold";
            headingText.appendChild(document.createTextNode(`[${task.category}] `));
            
            const titleText = document.createElement("span");
            titleText.appendChild(document.createTextNode(task.title));
            
            contentInfo.append(headingText, titleText);

            // Action interactive control items 
            const actionGroup = document.createElement("div");
            actionGroup.classList.add("task-actions");

            const completeBtn = document.createElement("button");
            completeBtn.classList.add("comp-action-btn");
            completeBtn.textContent = task.status === "completed" ? "Undo" : "Complete";
            completeBtn.style.color = "#000";

            const editBtn = document.createElement("button");
            editBtn.classList.add("edit-action-btn");
            editBtn.textContent = "Edit";
            editBtn.style.color = "#000";

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("del-action-btn");
            deleteBtn.textContent = "Delete";

            // Structural insertion using sequential mutation APIs (prepend/append/after targets)
            actionGroup.append(completeBtn, editBtn, deleteBtn);

            card.append(contentInfo, actionGroup);

            frag.append(card);
        });
        

        taskContainer.appendChild(frag);
        updateCountersAndStorage();
    }

    // Submit action handler via target standard EventListener API
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newTask = {
            id: "task-" + Date.now(),
            title: taskTitleInput.value.trim(),
            category: taskCategorySelect.value,
            status: "pending"
        };

        tasksCollection.push(newTask);
        renderTasks();
        taskForm.reset();
    });


    // ---- 6️⃣ Event Delegation Wrapper Architecture ----
    // Attaching one structural element handler to manage varying actions inside dynamically added cards
    taskContainer.addEventListener("click", (e) => {
        const targetBtn = e.target;
        const taskCard = targetBtn.closest(".task-card");
        if (!taskCard) return;

        const taskId = taskCard.dataset.id;
        const targetIndex = tasksCollection.findIndex(t => t.id === taskId);

        if (targetBtn.classList.contains("del-action-btn")) {
            // Delete configuration flow
            tasksCollection.splice(targetIndex, 1);
            renderTasks();
        } 
        else if (targetBtn.classList.contains("comp-action-btn")) {
            // Status toggle logic using modern attributes validation checks
            if (taskCard.hasAttribute("data-status")) {
                const currentStatus = taskCard.getAttribute("data-status");
                tasksCollection[targetIndex].status = currentStatus === "pending" ? "completed" : "pending";
            }
            renderTasks();
        } 
        else if (targetBtn.classList.contains("edit-action-btn")) {
            // Edit prompt update routine implementation
            const newTitle = prompt("Update your task title description:", tasksCollection[targetIndex].title);
            if (newTitle && newTitle.trim() !== "") {
                tasksCollection[targetIndex].title = newTitle.trim();
                renderTasks();
            }
        }
    });


    // ---- 4️⃣ Theme Toggle (classList + Dataset Engine) ----
    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const nextTheme = currentTheme === "light" ? "dark" : "light";
        
        // Updates the body dataset attribute map tracking layout state
        document.body.setAttribute("data-theme", nextTheme);
        themeToggleBtn.textContent =
        nextTheme === "light" ? "🌙 Dark" : "☀️ Light";
    });


    // ---- 7️⃣ Event Propagation Verification Engine (Bubbling vs Capturing) ----
    const grandparent = document.getElementById("grandparent");
    const parent = document.getElementById("parent");
    const childBtn = document.getElementById("child-btn");

    /**
     * EXPLANATION:
     * - Capturing Phase (Trickling): Triggers event handlers execution starting from root window downwards to targets.
     * - Bubbling Phase: Triggers event handler notifications starting from target element moving vertically upward to root window wrappers.
     */
    // Phase Configuration Flag: Passing { capture: true } registers handler specifically for the initialization down-pass
    grandparent.addEventListener("click", () => {
        console.log("CAPTURE RUNNING: Grandparent execution logged.");
    }, { capture: true });

    parent.addEventListener("click", () => {
        console.log("CAPTURE RUNNING: Parent execution logged.");
    }, { capture: true });

    childBtn.addEventListener("click", () => {
        console.log("CAPTURE RUNNING: Child Button target interaction executed.");
    }, { capture: true });

    // Standard Bubble phase tracking configurations (Default capture value defaults to false)
    grandparent.addEventListener("click", () => {
        console.log("BUBBLING RUNNING: Grandparent execution logged.");
    });

    parent.addEventListener("click", () => {
        console.log("BUBBLING RUNNING: Parent execution logged.");
    });

    childBtn.addEventListener("click", () => {
        console.log("BUBBLING RUNNING: Child Button targets bubbling executed.");
    });


    // ---- Helper Utilities & Bonus State Management Counters ----
    function updateCountersAndStorage() {
        const pendingItems = tasksCollection.filter(t => t.status === "pending").length;
        const completedItems = tasksCollection.filter(t => t.status === "completed").length;

        pendingCountSpan.textContent = pendingItems;
        completedCountSpan.textContent = completedItems;

        localStorage.setItem("tasks", JSON.stringify(tasksCollection));
    }

    clearAllBtn.addEventListener("click", () => {
        tasksCollection = [];
        renderTasks();
    });

    // Initial launch baseline paint execution render loop
    renderTasks();
});