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

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Configure database credentials in .env
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
Pantry-Chef/
├── backend/          # Django backend
├── frontend/         # React frontend
└── README.md
```
