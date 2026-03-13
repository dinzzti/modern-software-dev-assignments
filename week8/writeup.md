# Week 8 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**



This assignment took me about **2-3** hours to do. 


## App Concept 
"Si-Cuti" is a Leave Management System designed to allow employees to submit leave requests and administrators to manage them. The core features strictly follow CRUD principles:

Create: A form for employees to submit a new leave application (stating name, leave type, start/end dates, and reason).

Read: A main dashboard displaying a table of all leave requests along with summary metric cards.

Update: An action to update the status of a request (e.g., from 'Pending' to 'Approved' or 'Rejected').

Delete: An action to remove a leave request from the system.
This exact same concept and feature set is replicated across all three stack versions.



## Version #1 Description
APP DETAILS:
Folder name: version1-bolt
AI app generation platform: bolt.new
Tech Stack: React + Vite (Frontend only)
Persistence: localStorage (Browser-based)
Frameworks/Libraries Used: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations)
(Optional but recommended) Screenshots of core flows: (Not included, but app runs successfully on localhost:5173)

REFLECTIONS:
a. Issues encountered per stack and how you resolved them:
Finding the exact export/download mechanism on the free tier of bolt.new required some UI navigation. Also, ensuring that the app didn't crash on the first load when localStorage was empty was a potential issue. This was resolved by explicitly commanding the AI to generate initial mock data if the localStorage array was empty.

b. Prompting (e.g. what required additional guidance; what worked poorly/well):
Providing a highly detailed, enterprise-grade prompt worked exceptionally well. By explicitly defining the data model (LeaveRequest) and the exact UI components needed (Summary Cards, Status Badges, Modals), bolt.new generated a near-perfect application on the first try. Being explicit about using localStorage for persistence saved a lot of time by avoiding complex backend setups for this version.

c. Approximate time-to-first-run and time-to-feature metrics:
Time-to-first-run: ~5 minutes (mostly waiting for bolt.new to generate the code).
Time-to-feature: ~10 minutes (testing the CRUD features locally after running npm install and npm run dev).


## Version #2 Description
APP DETAILS:
Folder name: version2-python
AI app generation platform: Gemini AI
Tech Stack: Python FastAPI + HTML/Jinja2 (Fulfills the non-JavaScript requirement)
Persistence: SQLite (cuti.db)
Frameworks/Libraries Used: FastAPI, Uvicorn, Jinja2, python-multipart, Tailwind CSS (via CDN)
(Optional but recommended) Screenshots of core flows: (Not included, but app runs successfully on localhost:8000)

REFLECTIONS:
a. Issues encountered per stack and how you resolved them:
When dealing with a backend-rendered template, managing the dynamic Tailwind CSS classes within the Jinja2 template required careful syntax checking (e.g., changing text color based on the 'Approved' or 'Pending' status). I resolved database initialization issues by writing an init_db() function that automatically creates the SQLite table on app startup.

b. Prompting (e.g. what required additional guidance; what worked poorly/well):
I prompted the AI to build a minimal, single-file backend approach using Python to meet the non-JS requirement. It worked very well because FastAPI handles routing and form parsing cleanly. I had to specifically request the inclusion of python-multipart to ensure the HTML form submissions (Form(...)) were parsed correctly by FastAPI.

c. Approximate time-to-first-run and time-to-feature metrics:
Time-to-first-run: ~10 minutes (creating the virtual environment, installing requirements, and starting uvicorn).
Time-to-feature: ~15 minutes to verify all CRUD operations successfully committed to the SQLite database.


## Version #3 Description
APP DETAILS:
Folder name: version3-express
AI app generation platform: Gemini AI
Tech Stack: Node.js + Express.js + EJS
Persistence: In-memory Array
Frameworks/Libraries Used: Express, EJS, Tailwind CSS (via CDN)
(Optional but recommended) Screenshots of core flows: (Not included, but app runs successfully on localhost:3000)

REFLECTIONS:
a. Issues encountered per stack and how you resolved them:
Since persistence is handled via an in-memory array, the data resets every time the server restarts. While this is a known limitation, it is acceptable for the minimal scope of this version. Another minor issue was ensuring the views mapped correctly to the template engine, resolved by setting app.set('view engine', 'ejs').

b. Prompting (e.g. what required additional guidance; what worked poorly/well):
I asked the AI for a rapid, minimal Express app using EJS templates. I had to provide additional guidance to include express.urlencoded({ extended: true }) middleware so the server could properly extract data from the HTML POST forms. The AI handled the EJS loop syntax beautifully.

c. Approximate time-to-first-run and time-to-feature metrics:
Time-to-first-run: ~5 minutes (running npm init and installing express/ejs).
Time-to-feature: ~10 minutes. The simplicity of the stack made it the fastest to get up and running manually.