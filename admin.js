
const demoUsers = [
    { name: "Ali Valiyev", role: "student", status: "Faol" },
    { name: "Hasan Karimov", role: "student", status: "Faol" },
    { name: "Sardor Aliyev", role: "teacher", status: "Faol" }
];

document.getElementById("adminStudents").textContent = "2";
document.getElementById("adminTeachers").textContent = "1";
document.getElementById("adminTests").textContent = "0";

const table = document.getElementById("usersTable");

function renderUsers(users) {
    table.innerHTML = "";

    if (!users.length) {
        table.innerHTML = `<tr><td colspan="4">Foydalanuvchi topilmadi</td></tr>`;
        return;
    }

    users.forEach((user, index) => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        name.textContent = user.name;

        const role = document.createElement("td");
        role.textContent = user.role === "teacher" ? "Ustoz" : "O‘quvchi";

        const status = document.createElement("td");
        status.textContent = user.status;

        const action = document.createElement("td");
        const button = document.createElement("button");
        button.className = "admin-action-btn";
        button.textContent = "Ko‘rish";
        button.onclick = () => alert(user.name + " — " + role.textContent);

        action.appendChild(button);
        row.append(name, role, status, action);
        table.appendChild(row);
    });
}

renderUsers(demoUsers);

document.getElementById("userSearch").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    renderUsers(demoUsers.filter(user =>
        user.name.toLowerCase().includes(query)
    ));
});

document.getElementById("addTeacher").onclick = () => {
    alert("Ustoz qo‘shish funksiyasi Supabase ulanishida ishga tushiriladi.");
};

document.getElementById("adminLogout").onclick = () => {
    window.location.href = "index.html";
};
