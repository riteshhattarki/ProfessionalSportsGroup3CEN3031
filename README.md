# Dynasty Drafters
A fantasy basketball web app where users draft real NBA players and compete based on live stats pulled from the balldontlie API.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- External Data: balldontlie NBA API

## Setup

1. Clone the repo: git clone https://github.com/riteshhattarki/ProfessionalSportsGroup3CEN3031.git
2. Install backend dependencies: cd server && npm install
3. Install frontend dependencies: cd client && npm install
4. Copy server/.env.example to server/.env and fill in real values (MongoDB URI, balldontlie API key, JWT secret)
5. Start the backend: cd server && node index.js
6. Start the frontend (in a separate terminal): cd client && npm run dev
7. Backend runs on localhost:5000, frontend on localhost:5173