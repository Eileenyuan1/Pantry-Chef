# Remy's Cookbook

An AI-powered recipe generator that creates personalized recipes based on ingredients available in your pantry.

## Overview

Remy's Cookbook is a full-stack web application that helps users discover new recipes by leveraging their existing ingredients. Simply input what you have, and the system will generate tailored recipe suggestions.

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, RTK Query, Vite
- **Backend**: Django 4.2, Django REST Framework, PostgreSQL
- **Styling**: Custom CSS with hand-drawn typography

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL

### Installation

#### Backend Setup

1. Navigate to the backend directory and create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create and configure environment variables:
```bash
cp env.example .env
```
Edit `.env` and update the database credentials. On macOS, `DB_USER` is typically your system username.

4. Create the database:
```bash
createdb pantrychef
```

5. Run database migrations:
```bash
python manage.py migrate
```

#### Frontend Setup

1. Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### Running the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

### Database Migrations

Run `python manage.py migrate` when:
- Setting up the project for the first time
- After pulling new code that includes migration files
- After modifying database models (run `makemigrations` first)

## Project Structure

```
Pantry-Chef/
├── backend/          # Django backend
├── frontend/         # React frontend
└── README.md
```
