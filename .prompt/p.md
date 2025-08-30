#### Instructions

Act as js, react, and firebase developer.

we work on a web application that allows to test students with quizzes.
quizzes are about math and physics - need to render math formulas.
we want to keep architecture and development process as simple as possible.

current project files in context.xml

---

#### Task

We want to implement:

- loading json (copy it into a form) and saving it to firebase.
- search for quiz by a short description

Requirements:
We want to send a link to a students and they can open the quiz by the link, like app_url/quiz/quiz-id, where quiz-id is quiz id in firestore.
Now, if we paste the url into browser we got page not found message from firebase.

Question:
Is it a problem with firebase settings or our app. routing?

What implementation plan and structure would you suggest?

---

We want to add a field "Tutorial" to the quiz. It will contain a link to textbook or tutorial. When clicked, it should open another tab in a browser

---

functionality:

- login
- load quiz as json file.
- take a quiz
- keep results of the quiz persistent
- check results and statistics.

---

tech. stack:

- firebase hosting
- react
- Vite/CRA

---

current project files in context.xml

can you suggest a project structure?

create project prompt that we will use in VS Code Copilot, Gemini.
