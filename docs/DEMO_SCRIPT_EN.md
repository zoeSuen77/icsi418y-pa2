# PA2 Zoom demonstration script

Target length: **4–5 minutes**, including clicks. The words below are a practice guide; understand the code and explain it in your own words while recording the actual application in Zoom.

## Before recording

- Run and test the application. If using the course's Atlas setup, configure `server/.env` and use `npm run dev`. For the working local version, use `npm run demo`.
- Open the browser at `http://localhost:5173` and your editor at the project folder.
- Open `pa2.users` in MongoDB Atlas (course setup) or MongoDB Compass at `mongodb://127.0.0.1:27018` (local demo). The terminal command `npm run db:users -- --local` can also inspect local documents.
- Choose a new username for each take, for example `alex_pa2_take1`. Use first name `Alex`, last name `Chen`, and a disposable password such as `DemoPass123!`.
- Prepare `App.jsx`, `Signup.jsx`, `api.js`, `app.js`, `server.js`, and `passwords.js` in editor tabs. Keep `.env` closed.
- In Zoom, start a meeting, share the application/editor, and record. Check microphone audio first. Never display database credentials.

## 0:00–0:30 — Start the application

**Show:** The terminal command starting the application, the MongoDB connection message, and the running browser.

“This is my Programming Assignment 2 application. It uses React for the interface, Node.js and Express for the backend, and MongoDB to store users. The frontend runs on port 5173 and the backend runs on port 9000. Here is the running application. I can switch between login and signup.”

## 0:30–1:10 — Validation and successful signup

**Do:** Switch to Sign up. Submit an empty form, then enter the four demo fields and click Create account.

“The signup form asks for first name, last name, username, and password. Submitting an empty form displays a validation message. I will now enter the required information and create a user. The success message means the backend has stored the account in MongoDB.”

## 1:10–1:40 — Inspect MongoDB

**Do:** Refresh Atlas or Compass and filter by the demo username. Show the actual saved document.

“Here is the user document in the users collection. It has an automatically generated ID, first name, last name, username, and password. The password field contains a salted hash instead of the original password. The username has a unique index to prevent duplicate accounts.”

## 1:40–2:00 — Duplicate signup

**Do:** Return to the form and submit the same username again with all required fields.

“If I try to register the same username again, the server rejects it and the interface tells me the username is already taken. No second user is created. Usernames are case-insensitive in this implementation.”

## 2:00–2:40 — Login success and failure

**Do:** Switch to Log in. Enter the new username and correct password, then submit. After success, enter an incorrect password and submit again.

“With the correct credentials, the application displays a successful login message. For this assignment, successful login only needs an acknowledgement. Now I will enter an incorrect password. The server rejects it, and the interface displays a login failure message. An unknown username also fails.”

## 2:40–3:25 — Explain React state and HTTP

**Show:** `client/src/App.jsx`, `components/Signup.jsx`, and `api.js`.

“App switches between the Login and Signup components. Each form uses React's useState to store its input values and feedback. Each input has a value and an onChange handler, so React keeps track of what the user types.

“The submit handler prevents the browser from reloading the page. It calls postForm, which uses fetch to send a POST request with a JSON body. It checks the HTTP response and displays the server's message. The form is disabled while waiting. Network failures also produce a visible message.”

## 3:25–4:20 — Explain Express and MongoDB

**Show:** `server/server.js`, then the `/signup` and `/login` routes in `server/app.js`.

“The server loads its MongoDB connection string from the environment file. MongoClient connects to the pa2 database and the users collection. Before listening, the server creates the unique username index.

“The signup route validates all required fields and uses findOne to check for an existing username. If the username is available, it hashes the password and calls insertOne. It returns status 201 when the user is created, or 409 for a duplicate.

“The login route validates the credentials and finds the user by username. It checks the submitted password against the saved hash, returning 200 for success or 401 for incorrect credentials. Database errors return a safe message with status 500.”

## 4:20–4:40 — Password handling and finish

**Show:** `server/passwords.js`, then briefly the project folder and `.gitignore`.

“The password helper uses scrypt with a random salt and compares the derived hashes. The actual password is never returned to the frontend. The gitignore file excludes environment credentials, dependencies, and local database files. This completes the signup and login demonstration.”

Stop Zoom recording. Watch the resulting video and confirm that the sound, database document, success/failure messages, and code are readable before submitting it with the repository URL.
