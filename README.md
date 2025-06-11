# Full Stack Assignment: Employee Management App 

This is a full-stack application developed as part of the Guidona Softpedia interview process. The project consists of a frontend `Next.js` and backend application `Express.js`, each running in its own directory.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/arpittyagi102/task-for-underpin
   cd task-for-underpin
   ```

2. Install dependencies for all applications:
   ```bash
   npm run install-all
   ```
   This will install dependencies for:
   - Frontend application
   - Backend application

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3001
MONGO_URI=your-mongodb-URI
JWT_SECRET=yoursecretjwt
```

> ⚠️ It requires a Mongodb URI to run, You can use any temperary cluster

## Development Mode

The project can be run in development mode using the following commands:

1. Start the backend server:

   ```bash
   npm run server
   ```

   This will start the backend server in development mode with hot-reloading.

2. Start the frontend development server:

   ```bash
   npm run client
   ```

   This will start the frontend development server with hot-reloading.

3. To run both frontend and backend concurrently, you can open two terminal windows and run the respective commands.

## Additional Information

- The frontend application runs on `http://localhost:3000` by default
- The backend server runs on `http://localhost:3001` by default
- Make sure both servers are running for the application to work properly

## Support

If you encounter any issues during setup or development, please contact me or mail me, I will be available at first hour.

## Features Required

### Backend with Node (Express.js with Mongoose)
 - JWT based Authentication
   - `POST` **/register**
   - `POST` **/login**
   - `POST` **/validate-token**
 - Employees APIs
   - `GET` **/employees** – list with optional filters (department, search, pagination)
   - `POST` **/employees** – add new
   - `PUT` **/employees/:id** – update existing
   - `DELETE` **/employees/:id** – soft delete

### Frontend with Next.js (React)
   - Login Page
   - Signup Page
   - Employee List Page
     - Search by name
     - Filter by Department
     - Pagination
   - Add/Edit Employee Form Page
