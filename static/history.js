
document.addEventListener("DOMContentLoaded", () => {
    const historyTableBody = document.querySelector("#history-table tbody");

    fetch("/api/history")
        .then(response => response.json())
        .then(data => {
            data.data.forEach(row => {
                const tr = document.createElement("tr");
                const dateTd = document.createElement("td");
                const stepsTd = document.createElement("td");

                const dateLink = document.createElement("a");
                dateLink.href = `/day/${row.Date}`;
                dateLink.textContent = row.Date;
                dateTd.appendChild(dateLink);

                stepsTd.textContent = parseFloat(row["Total Steps"]).toFixed(2);

                tr.appendChild(dateTd);
                tr.appendChild(stepsTd);
                historyTableBody.appendChild(tr);
            });
        });
});
