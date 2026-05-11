Uniconnect – Frontend

Uniconnect is a web-based platform designed for students of a specific university to connect with peers and seniors. The platform enables users to explore other students’ interests and skill sets and build meaningful academic and professional connections.

This repository contains the frontend of the Uniconnect application.

Features

User-friendly interface built with React

Student discovery based on interests and skills

Profile exploration for peers and seniors

API-based data fetching from the backend

Fast development and build process using Vite

Tech Stack
Frontend

React.js – Component-based UI development

Vite – Fast build tool and development server

Axios – HTTP client for API communication

Project Structure
src/
├── components/      # Reusable UI components
├── pages/           # Application pages
├── services/        # API service files (Axios)
├── assets/          # Static assets
├── App.jsx          # Root component
├── main.jsx         # Application entry point

Getting Started
Prerequisites

Node.js (v18 or higher recommended)

npm or yarn

Installation

Clone the repository:

git clone https://github.com/Agent-Lawliet/uniconnect-frontend.git


Navigate to the project directory:

cd uniconnect-frontend


Install dependencies:

npm install


Start the development server:

npm run dev


The application will run at:

http://localhost:5173

API Configuration

The frontend communicates with the backend using Axios.
Update the base URL in the API configuration file as needed:

const BASE_URL = "https://uniconnect-psi.vercel.app";

Future Enhancements

Real-time chat between users

Advanced search and filtering

Notifications system

Improved UI/UX and accessibility

License

This project is for academic and learning purposes.
