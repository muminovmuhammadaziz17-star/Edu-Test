
const form = document.getElementById("testForm");
const container = document.getElementById("questionsContainer");
const message = document.getElementById("teacherMessage");
const testList = document.getElementById("teacherTestList");

let questions = [];
let tests = JSON.parse(
    localStorage.getItem("eduTests") || "[]"
);

function addQuestion() {
    const id = Date.now() + Math.random();

    const question = {
        id,
        text: "",
        options: ["", "", "", ""],
        correct: 0
    };

    questions.push(question);
    renderQuestions();
}

function renderQuestions() {
    container.innerHTML = "";

    questions.forEach((q, index) => {
        const card = document.createElement("div");
        card.className = "question-card";

        const heading = document.createElement("div");
        heading.className = "question-card-heading";

        const title = document.createElement("h3");
        title.textContent = `Savol ${index + 1}`;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-question";
        remove.textContent = "O‘chirish";

        remove.onclick = () => {
            questions = questions.filter(item => item.id !== q.id);
            renderQuestions();
        };

        heading.append(title, remove);

        const input = document.createElement("textarea");
        input.placeholder = "Savol matnini kiriting...";
        input.value = q.text;
        input.required = true;
        input.oninput = () => q.text = input.value;

        const label = document.createElement("p");
        label.className = "answer-label";
        label.textContent = "Javob variantlari (to‘g‘ri javobni belgilang)";

        card.append(heading, input, label);

        q.options.forEach((option, optionIndex) => {
            const row = document.createElement("div");
            row.className = "answer-row";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `correct-${q.id}`;
            radio.checked = q.correct === optionIndex;
            radio.value = optionIndex;
            radio.title = "To‘g‘ri javob";
            radio.onchange = () => q.correct = optionIndex;

            const answer = document.createElement("input");
            answer.type = "text";
            answer.placeholder = `Variant ${String.fromCharCode(65 + optionIndex)}`;
            answer.value = option;
            answer.required = true;
            answer.oninput = () => q.options[optionIndex] = answer.value;

            row.append(radio, answer);
            card.appendChild(row);
        });

        container.appendChild(card);
    });

    document.getElementById("teacherQuestionCount").textContent = questions.length;
}

document.getElementById("addQuestion").onclick = addQuestion;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("testTitle").value.trim();
    const subject = document.getElementById("testSubject").value;
    const className = document.getElementById("testClass").value;
    const time = Number(document.getElementById("testTime").value);
    const description = document.getElementById("testDescription").value.trim();

    if (!questions.length) {
        message.textContent = "Kamida bitta savol qo‘shing!";
        return;
    }

    const invalid = questions.some(q =>
        !q.text.trim() ||
        q.options.some(option => !option.trim())
    );

    if (invalid) {
        message.textContent = "Barcha savol va variantlarni to‘ldiring!";
        return;
    }

    tests.push({
        title,
        subject,
        className,
        time,
        description,
        questions: JSON.parse(JSON.stringify(questions)),
        createdAt: new Date().toLocaleString("uz-UZ")
    });

    renderTests();
    localStorage.setItem("eduTests", JSON.stringify(tests));

    message.style.color = "#4ade80";
    message.textContent = "Test demo rejimida saqlandi!";

    form.reset();
    questions = [];
    container.innerHTML = "";
    document.getElementById("testTime").value = 30;
    document.getElementById("teacherQuestionCount").textContent = "0";
});

function renderTests() {
    testList.innerHTML = "";

    tests.forEach((test, index) => {
        const card = document.createElement("div");
        card.className = "teacher-test-card";

        const info = document.createElement("div");

        const heading = document.createElement("h3");
        heading.textContent = test.title;

        const details = document.createElement("p");
        details.textContent =
            `${test.subject} · ${test.className} · ${test.questions.length} ta savol`;

        info.append(heading, details);

        const remove = document.createElement("button");
        remove.className = "remove-question";
        remove.textContent = "O‘chirish";

        remove.onclick = () => {
            tests.splice(index, 1);
            renderTests();
        };

        card.append(info, remove);
        testList.appendChild(card);
    });

    document.getElementById("teacherTestCount").textContent = tests.length;
}

document.getElementById("teacherLogout").onclick = () => {
    window.location.href = "index.html";
};

// Boshlang'ich bitta savol
addQuestion();

console.log("EDU TEST Teacher Panel loaded");

import { supabase } from "./supabase.js";

const { data: { user } } = await supabase.auth.getUser();

if (!user) location.href = "index.html";

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (!profile || !["teacher", "admin"].includes(profile.role)) {
  alert("Sizda o‘qituvchi huquqi yo‘q");
  location.href = "dashboard.html";
}

document.querySelector("#addTest")?.addEventListener("click", async () => {
  const title = document.querySelector("#testTitle").value.trim();
  const subject = document.querySelector("#subject").value.trim();
  const grade = Number(document.querySelector("#grade").value);
  const duration = Number(document.querySelector("#duration").value);

  if (!title || !subject || !grade || !duration) {
    return alert("Barcha maydonlarni to‘ldiring");
  }

  const { error } = await supabase.from("tests").insert({
    title, subject, grade, duration, created_by: user.id
  });

  if (error) return alert(error.message);

  alert("Test saqlandi!");
});
