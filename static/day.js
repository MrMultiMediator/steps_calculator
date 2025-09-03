
document.addEventListener("DOMContentLoaded", () => {
    const dateSpan = document.getElementById("date");
    const activitiesList = document.getElementById("activities-list");
    const date = window.location.pathname.split("/").pop();

    dateSpan.textContent = date;

    fetch(`/api/day/${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                activitiesList.textContent = data.error;
            } else {
                const activities = data.activities.split("; ");
                activities.forEach(activity => {
                    const p = document.createElement("p");
                    p.textContent = activity;
                    activitiesList.appendChild(p);
                });
            }
        });
});
