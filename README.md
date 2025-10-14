# React + TypeScript + Vite

🚀 Getting Started

Follow these steps to run the application locally.

1. Start the Backend Server

Navigate to the backend directory.

Install dependencies (if not already installed):

npm install

Run the backend in development mode:

npm run start:dev

Once the server starts, open your browser and visit:

http://localhost:3000/api/docs

This will open the Swagger API documentation for the backend.

2. Seed Initial User Data

From the Swagger docs, run the following endpoint to populate the database with sample user data:

GET http://localhost:3000/user/seed-users

💡 This step is required before you can log in or perform other user-related actions.

3. Start the Frontend (Client)

Open a new terminal and navigate to the frontend project directory.

Install dependencies if needed:

npm install

Run the development server:

npm run dev

Open the application in your browser at:

http://localhost:5173/

4. Using the App

Once the frontend is running:

Create a Customer — go to the Customers section and add a new customer.

Create a Job — navigate to Jobs and create a job for the customer.

View Job Details — click on a job to see full details.

Progress Job Status — use the button at the bottom of the job detail page to move the job through its stages (e.g., New → Scheduled → Done → Invoiced → Paid).

Make Payment — once the job is invoiced, you can process a payment to complete the workflow.
