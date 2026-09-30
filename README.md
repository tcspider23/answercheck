# AnswerCheck — Handwritten Answer Evaluation

A clean academic prototype for **Handwritten Answer Understanding with Layout Analysis and Rubric-Aware Feedback**.

## User workflow

1. Upload a handwritten answer image.
2. Read the answer.
3. Add the question.
4. Enter important key concepts separated by commas.
5. Enter total marks.
6. Analyze the answer.
7. View the score, covered concepts, missing concepts and feedback.

The interface intentionally keeps technical implementation details out of the student/teacher experience.

## No API key

This project does not require OpenAI, Gemini, or any paid API key. Handwriting recognition is performed in the browser using Tesseract.js loaded from a public CDN.

## Run locally

Open a terminal in the project folder:

```powershell
python -m http.server 8000
```

Then open:

`http://127.0.0.1:8000`

## Deployment

The project is a static web application and can be deployed directly to Vercel as a static site. No environment variables or secrets are required.

## Academic scope

The project demonstrates the complete flow from handwritten answer image to text, key-concept matching, marks calculation and feedback. Recognition quality depends on handwriting and image quality.
