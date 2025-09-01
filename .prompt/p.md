#### Instructions

Act as js, react, and firebase developer.

we work on a web application that allows to test students with quizzes.
quizzes are about math and physics - need to render math formulas.
we want to keep architecture and development process as simple as possible.

current project files in context.xml

tech. stack:

- React - Vite SVR
- firebase base settings
- firestore

---

Task:

We want to change nav bar.
now:
Quizzes
My Results
My Account
Other Students
Create Quiz

want:
Quizzes
Results
Create Quiz
Account

- Other Students (link in Account page)

if we click through Other Students -> View results (for a student) we got an
error:
hook.js:608 No routes matched location "/results/JbLETitxlgY77CXV2bzLrLjDZgq2"

We want to be able to see detailed results of quiz.
On "My Results" and Other Students -> Quiz Results
the quiz result will be a link to Details.
Details will include question text, and given answer, and is it correct or not.

After implementing your plan - separate student and teacher roles, we decided
against it.
We will have the only role - student, for now. (Later we add admin role, for
general administration purposes)

A user will have pages:
Quizzes
My Results
My Account
Other students (now Dashboard)
Create Quiz

Change the code to use student role only.

current project in context.xml

---

#### Question

We are trying to save url path to cookie, in case when not logged in user use direct link to a quiz,
like app/quiz/quiz-id
but after the logging in the user is not redirected (navigated) to the initial quiz page.

What can be done?

why do we get error: index-BaH_mDLF.js:464 Uncaught FirebaseError: Firebase: Error (auth/invalid-api-key).

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
