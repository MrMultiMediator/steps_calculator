# Run like this uvicorn main:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import csv
from datetime import datetime
import os
from typing import List, Dict, Any

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="static")

CSV_FILE = "activities.csv"
ACTIVITIES_FILE = "info.txt"

def get_step_conversions() -> Dict[str, float]:
    conversions = {
        "burpees": 21.1,
        "vigorous_yoga": 200.0,
        "intermediate_yoga": 150.0,
        "relaxing_yoga": 90.0,
    }
    with open(ACTIVITIES_FILE, "r") as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if "Other Activities Steps/ Minute" in line:
                for activity_line in lines[i+1:]:
                    if activity_line.strip():
                        parts = activity_line.strip().split()
                        steps = float(parts[-1])
                        name = "_".join(parts[:-1]).lower().replace(",", "")
                        conversions[name] = steps
    return conversions

STEP_CONVERSIONS = get_step_conversions()

def format_activity_name(name: str) -> str:
    return name.replace("_", " ").title()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "step_conversions": STEP_CONVERSIONS, "format_activity_name": format_activity_name})

@app.post("/submit")
async def submit(form_data: Request):
    form = await form_data.form()
    month = form.get("month")
    day = form.get("day")
    date_str = f"2025-{month}-{day}"

    total_steps = 0
    activities = []

    for activity, value in form.items():
        if activity not in ["month", "day"] and value and float(value) > 0:
            steps = float(value) * STEP_CONVERSIONS.get(activity, 0)
            total_steps += steps
            activities.append(f"{format_activity_name(activity)}: {value}")

    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Total Steps", "Activities"])

    date_exists = False
    rows = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, "r", newline="") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if header:
                rows.append(header)
            for row in reader:
                if row and row[0] == date_str:
                    row[1] = str(float(row[1]) + total_steps)
                    row[2] = row[2] + "; " + ", ".join(activities)
                    date_exists = True
                rows.append(row)

    if not date_exists:
        rows.append([date_str, str(total_steps), ", ".join(activities)])

    with open(CSV_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return JSONResponse(content={"message": "Activity logged successfully!"})


@app.get("/history", response_class=HTMLResponse)
async def read_history(request: Request):
    return templates.TemplateResponse("history.html", {"request": request})

@app.get("/api/history")
async def get_history_data():
    if not os.path.exists(CSV_FILE):
        return JSONResponse(content={"data": []})
    with open(CSV_FILE, "r", newline="") as f:
        reader = csv.reader(f)
        header = next(reader, None)
        data = [dict(zip(header, row)) for row in reader] if header else []
    return JSONResponse(content={"data": data})

@app.get("/day/{date}", response_class=HTMLResponse)
async def read_day(request: Request, date: str):
    return templates.TemplateResponse("day.html", {"request": request, "date": date})

@app.get("/api/day/{date}")
async def get_day_data(date: str):
    if not os.path.exists(CSV_FILE):
        return JSONResponse(content={"error": "No data found"}, status_code=404)
    with open(CSV_FILE, "r", newline="") as f:
        reader = csv.reader(f)
        next(reader)  # Skip header
        for row in reader:
            if row and row[0] == date:
                return JSONResponse(content={"date": row[0], "activities": row[2]})
    return JSONResponse(content={"error": "Date not found"}, status_code=404)

@app.get("/activities", response_class=HTMLResponse)
async def get_activities():
    return JSONResponse(content={"activities": list(STEP_CONVERSIONS.keys())})
