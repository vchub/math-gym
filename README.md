# Math & Physics Quiz App (Math Gym)

This project is a web application designed to test students with math and physics quizzes. It provides a simple and clean interface for users to log in, take quizzes that include complex mathematical formulas, and review their results.

This application is built with React and Vite, and it uses Firebase for backend services like authentication and database storage.

## Tech Stack

- **Frontend:** React
- **Build Tool:** Vite
- **Backend & Hosting:** Firebase (Authentication, Firestore, Hosting)
- **Routing:** React Router DOM
- **Math Rendering:** KaTeX & react-katex

## Features

- **User Authentication:** Secure login using Firebase Authentication.
- **Dynamic Quiz Loading:** Quizzes are loaded from a local JSON file (`public/quiz.json`).
- **LaTeX Math Rendering:** Displays mathematical and scientific notations correctly using KaTeX.
- **Persistent Results:** User quiz scores and answers are saved to Firestore.
- **Results Dashboard:** Users can view their past quiz attempts and scores.

## Project Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20.19.0 or later)
- npm
- Firebase Account & Firebase CLI

### Installation & Configuration

1.  **Clone the repository:**

    ```sh
    git clone <your-repository-url>
    cd math-gym
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Set up Firebase:**

    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - Add a new Web App to your project.
    - Copy the `firebaseConfig` object provided by Firebase.
    - Paste your configuration into the `src/firebase.js` file, replacing the placeholder values.
    - In the Firebase console, go to "Authentication" and enable a sign-in provider (e.g., Google).
    - Go to "Firestore Database" and create a database to store quiz results.

4.  **Run the development server:**

    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the project files using ESLint.
- `npm run preview`: Serves the production build locally to preview it.

## Deployment

This project is configured for deployment with Firebase Hosting.

1.  Log in to Firebase using the CLI:
    ```sh
    firebase login
    ```
2.  Build the project for production:
    ```sh
    npm run build
    ```
3.  Deploy the project to Firebase Hosting:
    ```sh
    firebase deploy
    ```
