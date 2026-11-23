/* =====================================
   STUDYSYNC - JAVASCRIPT
===================================== */


/* =====================================
   1. DATE AND DAILY MOTIVATION
===================================== */

const dateElement = document.getElementById("currentDate");

if (dateElement) {
    dateElement.textContent = new Date().toDateString();
}

const motivationQuotes = [
    "Your future is created by what you do today.",
    "Small steps every day create big achievements.",
    "Believe in yourself and keep learning.",
    "Success starts with a single step.",
    "Dream big, study smart and stay consistent."
];

const motivationElement = document.getElementById("motivationText");

if (motivationElement) {
    const day = new Date().getDate();
    motivationElement.textContent =
        motivationQuotes[day % motivationQuotes.length];
}


/* =====================================
   2. STUDY PLANNER
===================================== */

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span>📝</span>
                <p>No tasks yet. Add your first study task!</p>
            </div>
        `;
    }

    tasks.forEach(function(task) {

        const taskElement = document.createElement("div");

        taskElement.className =
            task.completed ? "task-item completed" : "task-item";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const taskTitle = document.createElement("h4");
        taskTitle.textContent = task.name;

        const taskDetails = document.createElement("p");
        taskDetails.textContent =
            task.subject + " • " + task.date;

        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDetails);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent =
            task.completed ? "Undo" : "✓ Done";

        completeButton.addEventListener("click", function() {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        taskElement.appendChild(taskInfo);
        taskElement.appendChild(actions);

        taskList.appendChild(taskElement);
    });

    updateDashboard();
}


taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newTask = {
        id: Date.now(),
        name: taskInput.value.trim(),
        subject: subjectInput.value,
        date: taskDate.value,
        completed: false
    };

    if (!newTask.name || !newTask.subject || !newTask.date) {
        alert("Please fill in all task details!");
        return;
    }

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskForm.reset();
});


/* =====================================
   3. DASHBOARD STATISTICS
===================================== */

let focusSessions = Number(
    localStorage.getItem("focusSessions")
) || 0;

function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("focusSessions").textContent =
        focusSessions;

    document.getElementById("completionRate").textContent =
        percentage + "%";

    document.getElementById("taskCount").textContent =
        total + (total === 1 ? " task" : " tasks");

    document.getElementById("progressPercentage").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";

    const progressMessage =
        document.getElementById("progressMessage");

    if (total === 0) {
        progressMessage.textContent =
            "Start adding tasks to track your progress!";
    } else if (percentage === 100) {
        progressMessage.textContent =
            "Amazing! You completed all your tasks! 🎉";
    } else {
        progressMessage.textContent =
            "You have completed " + completed +
            " out of " + total + " tasks. Keep going!";
    }
}


/* =====================================
   4. POMODORO FOCUS TIMER
===================================== */

let timeLeft = 25 * 60;
let timerInterval = null;
let timerRunning = false;

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");

const startButton = document.getElementById("startTimer");
const pauseButton = document.getElementById("pauseTimer");
const resetButton = document.getElementById("resetTimer");

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}

function startTimer() {

    if (timerRunning) return;

    timerRunning = true;
    timerStatus.textContent = "Stay focused! 🎯";

    timerInterval = setInterval(function() {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timerRunning = false;

            focusSessions++;

            localStorage.setItem(
                "focusSessions",
                focusSessions
            );

            updateDashboard();

            timerStatus.textContent = "Session completed! 🎉";

            alert("Great job! You completed a focus session.");

        }

    }, 1000);
}

function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerStatus.textContent = "Timer paused.";
}

function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timeLeft = 25 * 60;

    updateTimerDisplay();

    timerStatus.textContent = "Ready to focus?";
}

startButton.addEventListener("click", startTimer);

pauseButton.addEventListener("click", pauseTimer);

resetButton.addEventListener("click", resetTimer);

updateTimerDisplay();


/* =====================================
   5. QUIZ ZONE
===================================== */

const quizQuestions = [

    {
        question: "Which language is used to structure a webpage?",
        options: ["CSS", "HTML", "Python", "C"],
        answer: "HTML"
    },

    {
        question: "Which language is used to style webpages?",
        options: ["JavaScript", "C++", "CSS", "Java"],
        answer: "CSS"
    },

    {
        question: "Which keyword declares a variable in JavaScript?",
        options: ["let", "print", "include", "define"],
        answer: "let"
    },

    {
        question: "What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility",
            "Control Processing User"
        ],
        answer: "Central Processing Unit"
    },

    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["##", "//", "<!--", "**"],
        answer: "//"
    }

];

let currentQuestion = 0;
let quizScore = 0;
let quizFinished = false;

const startQuizButton = document.getElementById("startQuiz");
const quizArea = document.getElementById("quizArea");
const quizResult = document.getElementById("quizResult");

function startQuiz() {

    currentQuestion = 0;
    quizScore = 0;
    quizFinished = false;

    quizResult.textContent = "";

    showQuestion();
}

function showQuestion() {

    const question = quizQuestions[currentQuestion];

    quizArea.innerHTML = `
        <p class="quiz-question">
            Question ${currentQuestion + 1} of ${quizQuestions.length}
        </p>

        <h3 class="quiz-question">
            ${question.question}
        </h3>

        <div class="quiz-options">
            ${question.options.map(function(option, index) {
                return `
                    <button class="quiz-option"
                        data-index="${index}">
                        ${option}
                    </button>
                `;
            }).join("")}
        </div>

        <button id="nextQuestion" class="primary-btn" disabled>
            ${currentQuestion === quizQuestions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
        </button>
    `;

    let selectedAnswer = null;

    const optionButtons =
        quizArea.querySelectorAll(".quiz-option");

    const nextButton =
        document.getElementById("nextQuestion");

    optionButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            if (selectedAnswer !== null) return;

            selectedAnswer = Number(button.dataset.index);

            const correctIndex =
                question.options.indexOf(question.answer);

            if (selectedAnswer === correctIndex) {
                quizScore++;
                button.style.background = "#d8f8e5";
            } else {
                button.style.background = "#ffe0e0";
                optionButtons[correctIndex].style.background =
                    "#d8f8e5";
            }

            optionButtons.forEach(function(item) {
                item.disabled = true;
            });

            nextButton.disabled = false;
        });
    });

    nextButton.addEventListener("click", function() {

        if (selectedAnswer === null) return;

        currentQuestion++;

        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showQuizResult();
        }
    });
}

function showQuizResult() {

    quizFinished = true;

    const percentage =
        Math.round((quizScore / quizQuestions.length) * 100);

    quizArea.innerHTML = `
        <div class="quiz-finish">
            <h2>🎉 Quiz Completed!</h2>
            <h1>${quizScore} / ${quizQuestions.length}</h1>
            <p>Your score: ${percentage}%</p>

            <button id="restartQuiz" class="primary-btn">
                Try Again ↻
            </button>
        </div>
    `;

    quizResult.textContent =
        percentage >= 80
            ? "Excellent work! Keep it up! 🌟"
            : "Good attempt! Practice and improve! 💜";

    document.getElementById("restartQuiz")
        .addEventListener("click", startQuiz);
}

startQuizButton.addEventListener("click", startQuiz);


/* =====================================
   6. NAVIGATION ACTIVE STATE
===================================== */

const navigationLinks =
    document.querySelectorAll(".nav-link");

navigationLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        navigationLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


/* =====================================
   7. INITIALIZE APP
===================================== */

renderTasks();
updateDashboard();

console.log("StudySync loaded successfully! 🚀");
