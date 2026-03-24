# Campus Navigator - Full Project (Backend + Frontend)
## Overview
This repository contains a complete MERN stack starter for the Campus Navigator & Resource Booking System.
It includes:
- backend/ (Express + Mongoose)
- frontend/ (React)

## Quickstart (Linux)
### Backend
1. cd campus-backend
2. npm install
3. copy .env.example to .env and set MONGO_URI
4. npm run seed
5. npm run dev

### Frontend
1. cd campus-frontend
2. npm install
3. create .env with: REACT_APP_API_URL=http://localhost:5000
4. npm start

## Deployment
- Build frontend: npm run build
- Deploy frontend to Netlify/Vercel
- Deploy backend to Render/Heroku and set MONGO_URI
