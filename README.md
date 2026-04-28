# GitHub Analyzer

GitHub Analyzer is a small full-stack project for exploring public GitHub profiles. It combines a FastAPI backend with a static frontend that presents profile details, repository information, and a language breakdown in a polished single-page UI.

## Features

- Search for any public GitHub username
- View profile details such as avatar, bio, followers, following, public repos, and gists
- See a language distribution chart based on public repositories
- Browse top repositories ranked by star count
- Use a FastAPI backend with GitHub API helper endpoints
- Present results in a responsive frontend with Chart.js visualizations

## Tech Stack

- Backend: FastAPI, HTTPX, python-dotenv
- Frontend: HTML, CSS, vanilla JavaScript, Chart.js
- Data source: GitHub REST API

## Project Structure

```text
github-analyzer/
|-- backend/
|   |-- main.py
|   |-- github_service.py
|-- frontend/
|   |-- index.html
|   |-- script.js
|   |-- style.css
|-- .env
|-- requirements.txt
```

## How It Works

The backend exposes three API endpoints:

- `GET /user/{username}` returns the GitHub user profile
- `GET /repos/{username}` returns up to 100 public repositories sorted by recent updates
- `GET /languages/{username}` returns a count of repository languages

The frontend provides the UI for entering a username and rendering:

- profile summary
- top repositories
- language chart

## Important Note About the Current Implementation

The current frontend in `frontend/script.js` fetches data directly from `https://api.github.com/users/...` in the browser.

That means:

- the frontend is not currently calling the FastAPI backend
- the backend token in `.env` is only used by the backend endpoints
- GitHub API rate limits in the browser will still apply unless the frontend is updated to use your backend routes

If you want the frontend to use the backend, update `frontend/script.js` to call endpoints like:

- `http://127.0.0.1:8000/user/<username>`
- `http://127.0.0.1:8000/repos/<username>`
- `http://127.0.0.1:8000/languages/<username>`

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd github-analyzer
```

### 2. Create and activate a virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a `.env` file

Add your GitHub personal access token:

```env
GITHUB_TOKEN=your_github_token_here
```

A token is optional for public GitHub data, but it helps avoid strict rate limits when using the backend.

## Run the Backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Run the Frontend

Open `frontend/index.html` in a browser, or serve the folder locally.

Example with Python:

```bash
cd frontend
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

## Example API Routes

- `GET /`
- `GET /user/octocat`
- `GET /repos/octocat`
- `GET /languages/octocat`

## Possible Improvements

- Connect the frontend to the FastAPI backend instead of calling GitHub directly
- Add loading and error handling for backend API failures
- Cache GitHub responses to reduce repeated requests
- Add analytics such as total stars, forks, pinned repositories, and contribution summaries
- Add deployment configuration for the frontend and backend

## License

This project uses GitHub public API data for educational and portfolio purposes.
