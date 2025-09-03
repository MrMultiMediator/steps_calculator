
document.addEventListener("DOMContentLoaded", () => {
    const activitiesContainer = document.getElementById("activities-container");
    const form = document.getElementById("activity-form");
    const message = document.getElementById("message");

    fetch("/activities")
        .then(response => response.json())
        .then(data => {
            const activities = data.activities;
            const customOrder = ["burpees", "vigorous_yoga", "intermediate_yoga", "relaxing_yoga"];
            const sortedActivities = activities.sort((a, b) => {
                const aIndex = customOrder.indexOf(a);
                const bIndex = customOrder.indexOf(b);
                if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
                if (aIndex > -1) return -1;
                if (bIndex > -1) return 1;
                return a.localeCompare(b);
            });

            sortedActivities.forEach(activity => {
                const activityEl = document.createElement("div");
                activityEl.classList.add("activity");

                const label = document.createElement("label");
                label.setAttribute("for", activity);

                const input = document.createElement("input");
                input.setAttribute("type", "number");
                input.setAttribute("id", activity);
                input.setAttribute("name", activity);
                input.setAttribute("min", "0");

                if (["burpees", "vigorous_yoga", "intermediate_yoga", "relaxing_yoga"].includes(activity)) {
                    const tooltip = document.createElement("div");
                    tooltip.classList.add("tooltip");
                    label.textContent = formatActivityName(activity);
                    tooltip.appendChild(label);

                    const tooltipText = document.createElement("span");
                    tooltipText.classList.add("tooltiptext");
                    tooltipText.textContent = getTooltipText(activity);
                    tooltip.appendChild(tooltipText);
                    activityEl.appendChild(tooltip);
                } else {
                    label.textContent = formatActivityName(activity);
                    activityEl.appendChild(label);
                }

                activityEl.appendChild(input);
                activitiesContainer.appendChild(activityEl);
            });
        });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        fetch("/submit", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            message.textContent = data.message;
            form.reset();
            setTimeout(() => message.textContent = "", 3000);
        });
    });

    function formatActivityName(name) {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    function getTooltipText(activity) {
        switch (activity) {
            case "burpees":
                return "1 burpee = 21.1 steps. This is based on doing burpees at a rate of 10 per minute, which is comparable to vigorous activities like running a 10-minute mile.";
            case "vigorous_yoga":
                return "1 minute = 200 steps. This is for vigorous yoga sessions, which can be as strenuous as other high-impact exercises.";
            case "intermediate_yoga":
                return "1 minute = 150 steps. For yoga sessions of moderate intensity.";
            case "relaxing_yoga":
                return "1 minute = 100 steps. For gentle or relaxing yoga practices.";
            default:
                return "";
        }
    }
});
