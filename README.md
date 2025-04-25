
# Task Tracker

A task management web application that allows users to sign up, log in, and manage their tasks. Users can create, edit, and mark tasks as complete, set deadlines, and organize them by project name. The app also includes an admin panel for managing users and tasks.

## Features

- **User Authentication**: Sign up, login, and logout with Firebase Authentication.
- **Task Management**: 
  - Add tasks with details like task name, description, deadline, and project name.
  - Mark tasks as complete or incomplete.
  - Set and edit deadlines for each task.
  - View and filter tasks by project name or completion status.
- **Admin Panel**: Admins can manage users and their tasks.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Firebase (Firestore for database, Firebase Authentication for user auth)
- **Admin Panel**: Separate route for admins to manage tasks and users.
- **Styling**: Bootstrap (or your preferred CSS framework)

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed. You can check if they are installed with the following commands:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-tracker.git
   cd task-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. **Set up your `.env` file**:

   This project uses environment variables to store Firebase configuration securely. Create a `.env` file in the root of your project with the following content, and replace the placeholders with your own Firebase project details:

   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key
   ```

   > ⚠️ **Important:** Your `.env` file is included in `.gitignore` and will not be committed to version control. Make sure each developer sets up their own `.env`.

4. Run the development server:

   ```bash
   npm start
   ```

   Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- **User Authentication**: 
  - Sign up and log in using Firebase authentication (email/password or other methods you set up).
  
- **Task Management**:
  - Create a new task by filling in the task name, description, deadline, and project name.
  - Toggle task completion status.
  - Edit or delete tasks as needed.
  
- **Admin Panel**: 
  - Admin users have access to a special admin panel (e.g., `/admin` route).
  - Admins can manage users and their associated tasks.

## Admin Panel

To access the admin panel:
1. Log in with an admin account (you can set this manually in your Firebase Firestore).
2. Navigate to `/admin` to manage users and their tasks.

In the admin panel, admins can:
- View and edit user roles.
- View and edit tasks for all users.

## Known Issues

- None at the moment!

## Future Improvements

- Task prioritization (e.g., high, medium, low priority).
- Task notifications or reminders.
- Custom user roles and permissions.
- Better UI/UX design.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
