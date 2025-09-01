### Add functionality

#### Store correct question number (not value)

Example:

Now:

    {
      "id": 2,
      "text": "What is the integral of $f(x) = x^2$?",
      "options": [
        "$$ \\frac{x^3}{3} + C $$",
        "$$ 2x + C $$",
        "$$ x^3 + C $$",
        "$$ \\frac{x^2}{2} + C $$"
      ],
      "answer": "$$ \\frac{x^3}{3} + C $$"
    },

Should be:

    {
      "id": 2,
      "text": "What is the integral of $f(x) = x^2$?",
      "options": [
        "$$ \\frac{x^3}{3} + C $$",
        "$$ 2x + C $$",
        "$$ x^3 + C $$",
        "$$ \\frac{x^2}{2} + C $$"
      ],
      "answer": 0
    },

---

#### Add explanation field to quiz question

Example:

"questions": [
{
"id": 1,
"text": "What is the value of $x$ in the equation $2x + 3 = 11$?",
"options": [ "3", "4", "5", "6" ],
"answer": "4",
"explanation": "$2x = 11 - 3; x = (11-3)/2$"
}
... ]

When a user click an ption, the explanation is shown.

---

#### show current question number and total number of questions in the quiz

---

#### Add Teacher role

- A user can add a teacher by email (gmail)
- Teacher has a list of users which added the teacher
- Teacher can click on the user and see user quiz results

---
