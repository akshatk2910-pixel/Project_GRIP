/* =========================
   NAV ACTIVE + MODE SWITCH
========================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {
    item.addEventListener("click", function() {
        navItems.forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
    });
});

function setMode(mode) {
    if (mode === "clutch") {
        document.body.classList.add("clutch");
        localStorage.setItem("mode", "clutch");
    } else {
        document.body.classList.remove("clutch");
        localStorage.setItem("mode", "grip");
    }
}
window.addEventListener("load", () => {

    // Force Grip Mode on every load
    document.body.classList.remove("clutch");
    localStorage.setItem("mode", "grip");

    // Fix navbar active state
    navItems.forEach(nav => nav.classList.remove("active"));
    navItems[0].classList.add("active");

});


/* =========================
   REAL TIME CLOCK
========================= */

function updateClock() {
    document.getElementById("clock").textContent =
        new Date().toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();


/* =========================
   SESSION GOAL SYSTEM
========================= */

let totalSessions = 5;
let completedSessions = parseInt(localStorage.getItem("sessions")) || 0;

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

/* ---------- DAILY RESET CHECK ---------- */

function checkDailyReset() {

    const lastReset = localStorage.getItem("lastReset");
    const now = Date.now();

    if (!lastReset) {
        localStorage.setItem("lastReset", now);
        return;
    }

    const hoursPassed = (now - lastReset) / (1000 * 60 * 60);

    if (hoursPassed >= 24) {
        completedSessions = 0;
        localStorage.setItem("sessions", 0);
        localStorage.setItem("lastReset", now);
    }
}

checkDailyReset();

/* ---------- UPDATE PROGRESS ---------- */

function updateProgress() {
    let percent = (completedSessions / totalSessions) * 100;
    progressBar.style.width = percent + "%";
    progressText.textContent = `${completedSessions} / ${totalSessions} sessions`;
}

updateProgress();


/* =========================
   MOTIVATIONAL QUOTES
========================= */

const quotes = [
    "🔔 Assignment due tomorrow — small step today?",
    "🔥 Small focus today = big results tomorrow.",
    "📚 Discipline beats motivation.",
    "🚀 25 minutes can change your day.",
    "🎯 One session closer to mastery.",
    "💪 You don’t need 5 hours. Just start."
];

const nudgeCard = document.querySelector(".nudge");
let quoteIndex = 0;

setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    nudgeCard.textContent = quotes[quoteIndex];
}, 10000);


/* =========================
   POMODORO TIMER
========================= */

let timerInterval = null;
let defaultTime = 25 * 60;
let timeLeft = defaultTime;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const startButton = document.querySelector(".focus button");

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

updateTimerDisplay();


function startPomodoro() {

    if (isRunning) return;

    isRunning = true;
    startButton.textContent = "Running...";

    timerInterval = setInterval(() => {

        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            completeSession();
        }

    }, 1000);
}


function pausePomodoro() {

    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Resume";
}


function completeSession() {

    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = "Start";

    if (completedSessions < totalSessions) {
        completedSessions++;
        localStorage.setItem("sessions", completedSessions);
    }

    timeLeft = defaultTime;
    updateTimerDisplay();
    updateProgress();

    showCongrats();
}


/* =========================
   CONGRATS POPUP
========================= */

function showCongrats() {

    const popup = document.createElement("div");
    popup.className = "congrats-popup";
    popup.innerHTML = `
        <h2>🔥 Session Complete!</h2>
        <p>You're building discipline. Keep going.</p>
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 100);

    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 500);
    }, 3000);
}


/* =========================
   CALENDAR
========================= */

const calendarBox = document.getElementById("calendarBox");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const calendarDates = document.getElementById("calendarDates");

function toggleCalendar() {
    calendarBox.classList.toggle("active");
}

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

months.forEach((month, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.text = month;
    monthSelect.appendChild(option);
});

for (let year = 2024; year <= 2030; year++) {
    let option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
}

function generateCalendar() {

    calendarDates.innerHTML = "";

    let month = parseInt(monthSelect.value);
    let year = parseInt(yearSelect.value);
    let days = new Date(year, month + 1, 0).getDate();

    let savedDate = localStorage.getItem("selectedDate");

    for (let day = 1; day <= days; day++) {

        let dateDiv = document.createElement("div");
        dateDiv.classList.add("date");
        dateDiv.textContent = day;

        if (savedDate === `${day}-${month}-${year}`) {
            dateDiv.classList.add("selected");
        }

        dateDiv.addEventListener("click", () => {
            document.querySelectorAll(".date")
                .forEach(d => d.classList.remove("selected"));

            dateDiv.classList.add("selected");
            localStorage.setItem("selectedDate", `${day}-${month}-${year}`);
        });

        calendarDates.appendChild(dateDiv);
    }
}

monthSelect.addEventListener("change", generateCalendar);
yearSelect.addEventListener("change", generateCalendar);

let today = new Date();
monthSelect.value = today.getMonth();
yearSelect.value = today.getFullYear();
generateCalendar();