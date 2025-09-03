# Steps Challenge Web App

This web application provides a simple and effective way to track your fitness activities by converting them into an equivalent number of steps. It's designed for users who feel their activities are not accurately represented by traditional step counters.

The application allows for custom step conversions, giving you the flexibility to define how your efforts are measured.

## Features

*   **Log Activities:** Easily log various fitness activities for any given day.
*   **Automatic Step Conversion:** Automatically converts logged activities into steps based on predefined conversion rates.
*   **Historical View:** Browse a history of your logged activities and see your progress over time.
*   **Daily Details:** View a detailed breakdown of activities for a specific day.
*   **Customizable Conversions:** Modify or add your own activity-to-step conversions by editing a simple text file.

## Tech Stack

*   **Backend:** Python with FastAPI
*   **Frontend:** HTML, CSS, JavaScript
*   **Data Storage:** CSV file (`activities.csv`)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   Python 3.7+
*   pip

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd steps_challenge
    ```

2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Running the Application

To start the web server, run the following command in the project's root directory:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

You can then access the application by navigating to `http://localhost:8000` in your web browser.

## Usage

*   **Home Page:** Log your activities for a specific date. Select the month and day, enter the duration or quantity for each activity, and click "Log Activity".
*   **History Page:** View a table of all your past entries, including the date, total steps, and a summary of activities.
*   **Day Details:** Click on a date in the history table to see a more detailed breakdown of the activities for that day.

## Customization

You can easily customize the activity-to-step conversions by editing the `info.txt` file.

### Adding New Activities

To add a new activity, open `info.txt` and add a new line under the "Other Activities Steps/ Minute" section. Follow the existing format:

```
New Activity Name 123
```

The activity name will be automatically converted to a machine-readable format (e.g., `new_activity_name`), and the number at the end will be used as the step conversion rate.
