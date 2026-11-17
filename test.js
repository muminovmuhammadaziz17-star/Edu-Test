
const $ = id => document.getElementById(id);

let tests = JSON.parse(localStorage.getItem("eduTests") || "[]");
let currentTest = null;
let currentQuestion = 0;
let answers = {};
let timerInterval;
let remaining = 0;

function renderTests() {
    $("availableTests").innerHTML = "";

    if (!tests.length) {
        $("availableTests").textContent =
            "Hozircha test yo‘q. Ustoz test yaratishi kerak.";
        return;
    }

    tests.forEach((test, index) => {
        const card = document.createElement("div");
        card.className = "teacher-test-card";

        const info = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = test.title;

        const detail = document.createElement("p");
        detail.textContent =
            `${test.subject} | ${test.className} | ${test.questions.length} savol`;

        const button = document.createElement("button");
        button.className = "admin-add-btn";
        button.textContent = "Boshlash";
        button.onclick = () => startTest(index);

        info.append(title, detail);
        card.append(info, button);
        $("availableTests").appendChild(card);
    });
}

function startTest(index) {
    currentTest = tests[index];
    currentQuestion = 0;
    answers = {};

    $("testSelection").classList.add("hidden");
    $("quizSection").classList.remove("hidden");

    $("quizTitle").textContent = currentTest.title;
    $("quizInfo").textContent =
        `${currentTest.subject} | ${currentTest.className}`;

    remaining = Number(currentTest.time) * 60;
    updateTimer();

    timerInterval = setInterval(() => {
        remaining--;
        updateTimer();

        if (remaining <= 0) finishTest();
    }, 1000);

    renderQuestion();
}

function updateTimer() {
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    $("timer").textContent =
        `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function renderQuestion() {
    const q = currentTest.questions[currentQuestion];
    $("questionNumber").textContent =
        `${currentQuestion + 1} / ${currentTest.questions.length}`;

    $("progressBar").style.width =
        `${((currentQuestion + 1) / currentTest.questions.length) * 100}%`;

    const area = $("questionArea");
    area.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = `${currentQuestion + 1}. ${q.text}`;
    heading.style.margin = "25px 0";

    area.appendChild(heading);

    q.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "quiz-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.checked = answers[currentQuestion] === index;

        radio.onchange = () => {
            answers[currentQuestion] = index;
        };

        const span = document.createElement("span");
        span.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        label.append(radio, span);
        area.appendChild(label);
    });

    $("previousBtn").disabled = currentQuestion === 0;
    $("nextBtn").style.display =
        currentQuestion === currentTest.questions.length - 1
            ? "none" : "block";
}

$("previousBtn").onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
};

$("nextBtn").onclick = () => {
    if (currentQuestion < currentTest.questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
};

$("finishBtn").onclick = finishTest;

function finishTest() {
    if (!currentTest) return;

    clearInterval(timerInterval);

    let correct = 0;

    currentTest.questions.forEach((q, index) => {
        if (answers[index] === Number(q.correct)) correct++;
    });

    const total = currentTest.questions.length;
    const percent = Math.round(correct / total * 100);
    const points = correct * 10;

    const studentName =
        localStorage.getItem("eduStudentName") || "O‘quvchi";

    const results = JSON.parse(
        localStorage.getItem("eduResults") || "[]"
    );

    results.push({
        name: studentName,
        test: currentTest.title,
        correct,
        total,
        percent,
        points,
        date: new Date().toLocaleString("uz-UZ")
    });

    localStorage.setItem("eduResults", JSON.stringify(results));

    $("quizSection").classList.add("hidden");
    $("resultSection").classList.remove("hidden");

    $("resultScore").textContent = percent + "%";
    $("resultDetails").textContent =
        `${total} ta savoldan ${correct} tasi to‘g‘ri. Siz ${points} ball oldingiz.`;
}
localStorage.setItem("eduTests", JSON.stringify(tests));
renderTests();

