
const results = JSON.parse(
    localStorage.getItem("eduResults") || "[]"
);

const students = {};

results.forEach(result => {
    if (!students[result.name]) {
        students[result.name] = {
            name: result.name,
            tests: 0,
            points: 0
        };
    }

    students[result.name].tests++;
    students[result.name].points += result.points;
});

const sorted = Object.values(students).sort(
    (a, b) => b.points - a.points
);

const table = document.getElementById("rankingTable");

if (!sorted.length) {
    table.innerHTML = `
        <tr>
            <td colspan="4">Hozircha reyting mavjud emas.</td>
        </tr>`;
} else {
    sorted.forEach((student, index) => {
        const row = document.createElement("tr");

        [index + 1, student.name, student.tests, student.points]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

        table.appendChild(row);
    });
}
