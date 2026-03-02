🚀 Discvrai Product Discovery App
📌 Overview

This is a full-stack product discovery application built using:

React (Frontend)

Node.js + Express (Backend)

OpenAI API (LLM Integration)

Users can:

View available products

Ask natural language queries (e.g., "cheap gaming laptop")

Get intelligent product recommendations

🧠 LLM Integration

The /api/ask endpoint:

Receives user query

Sends full product catalog context to OpenAI

Forces structured JSON response

Parses product IDs

Returns matched products + explanation

Falls back to keyword-based filtering if API fails

This ensures reliability even when quota limits occur.

🛠 Tech Stack

Frontend:

React

useState

useEffect

Fetch API

Backend:

Express

OpenAI SDK

dotenv

cors

📂 Project Structure
product-discovery/
  ├── backend/
  ├── frontend/
  └── README.md
⚙️ Setup Instructions
1. Clone the repo
git clone <your-repo-url>
cd product-discovery
2. Backend Setup
cd backend
npm install

Create .env file:

OPENAI_API_KEY=your_key_here

Start server:

node server.js
3. Frontend Setup
cd frontend
npm install
npm start
✅ Features Implemented

REST API design

Product catalog (20 products)

LLM-powered recommendations

Structured AI output parsing

Error handling (502, 503)

Fallback logic for quota failures

Reusable React components

Clean separation of frontend & backend
