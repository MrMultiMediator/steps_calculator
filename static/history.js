
document.addEventListener("DOMContentLoaded", () => {
    const historyTableBody = document.querySelector("#history-table tbody");
    const historyPageTooltip = document.createElement("div");
    historyPageTooltip.id = "history-page-tooltip";
    document.body.appendChild(historyPageTooltip);

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

                dateTd.addEventListener("mouseover", (e) => {
                    fetch(`/api/day/${row.Date}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                return;
                            }
                            historyPageTooltip.innerHTML = data.activities.split("; ").join("<br>");
                            const rect = dateTd.getBoundingClientRect();
                            historyPageTooltip.style.left = `${rect.left + window.scrollX}px`;
                            historyPageTooltip.style.top = `${rect.bottom + window.scrollY}px`;
                            historyPageTooltip.style.display = "block";
                        });
                });

                dateTd.addEventListener("mouseout", () => {
                    historyPageTooltip.style.display = "none";
                });
            });
        });
});
