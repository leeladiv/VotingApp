## 📌 Project Overview

This project is a **frontend-only voting (polling) application** built with **Vue 3 and Tailwind CSS**.
It is designed to evaluate your understanding of **modern frontend development concepts** including state management, composables, directives, and browser storage.

The application allows users to create polls, add candidates and voters, conduct voting within a specified time, and view ranked results.

---

## 🎯 Learning Objectives

By completing this project, the you'll demonstrate:

* Proper use of **Vue 3 component architecture**
* State management using **stores**
* Logic reuse using **composables**
* Data persistence using **localStorage**
* Application of **Vue directives**
* Clean UI design using **Tailwind CSS**
* Real-world application logic and constraints

---

## 🛠️ Technologies Used

* **Vue 3**
* **Tailwind CSS**
* **HTML**
* **JavaScript**
* **localStorage**

---

## 📋 Application Features

### 1️⃣ Poll Management

The application must allow users to:

* Create a poll with:

  * Poll title
  * Description
  * Start date and time
  * End date and time
* View all created polls
* Display poll status automatically:

  * **Upcoming** – before start time
  * **Ongoing** – between start and end time
  * **Ended** – after end time

⛔ Voting must be disabled outside the poll’s active time.

---

### 2️⃣ Candidate Management

For each poll, users must be able to:

* Add candidates with:

  * Full name
  * Photo (URL or placeholder image)
  * Manifesto (detailed description of goals)
* View candidate details:

  * Name
  * Photo
  * Full manifesto
  * Vote count (visible only after poll ends)

---

### 3️⃣ Voter Management

For each poll, users must be able to:

* Add voters with:

  * Full name
  * Unique identifier (ID, email, or phone number)
* Enforce voter uniqueness:

  * A voter **can only vote once per poll**
  * A voter **may exist in multiple polls**

---

### 4️⃣ Voting Logic

* Voting is allowed **only during the poll’s active period**
* Each voter:

  * Can vote **only once per poll**
* After voting:

  * The voter is marked as “Voted”
  * Vote counts update immediately

---

### 5️⃣ Candidate Ranking

* Candidates must be automatically ranked by:

  * Total number of votes
* Ranking rules:

  * Highest votes = Rank 1
* Rankings should be visible:

  * After poll ends
  * (Live ranking is optional)

---

## 🧩 Technical Requirements (Mandatory)

### Vue Concepts to Be Used

| Concept             | Requirement                                  |
| ------------------- | -------------------------------------------- |
| Components          | Separate UI into reusable components         |
| Composables         | Extract reusable logic                       |
| Store               | Centralized state management                 |
| Vue Directives      | `v-if`, `v-for`, `v-model`, `v-bind`, `v-on` |
| Computed Properties | Poll status, rankings                        |
| Watchers            | Time-based poll updates                      |
| localStorage        | Persist all application data                 |

---

### Required Composables

At least **two composables** must be created, such as:

#### `usePolls.js`

* Create and manage polls
* Determine poll status
* Save and retrieve polls from localStorage

#### `useVoting.js`

* Handle voting logic
* Prevent duplicate voting
* Rank candidates

---

### Store Requirements

The store must manage:

* Polls
* Candidates
* Voters
* Votes

All updates must flow through the store.

---

## 📊 Evaluation Criteria (100 Marks)

### Functionality – 40 Marks

* Poll creation and timing logic
* Voting rules and restrictions
* Candidate ranking
* Voter uniqueness enforcement

---

### Vue & Architecture – 30 Marks

* Proper component structure
* Correct use of composables
* Store-based state management

---

### Data Persistence – 15 Marks

* Correct use of localStorage
* Data retained after page refresh

---

### UI / UX – 10 Marks

* Tailwind CSS styling
* Usability and clarity

---

### Code Quality – 5 Marks

* Clean structure
* Meaningful variable and file names

---

## ⭐ Bonus (Optional)

* Live vote updates
* Countdown timer to poll end
* Search or filter polls
* Export results as JSON

---

## 📦 Submission Requirements

* All project are to be submited on January 03, 2026, 11:59pm

---

## ✅ Completion Criteria

A project is considered complete when:

* All mandatory features are implemented
* All required Vue concepts are used
* Data persists using localStorage
* The UI is clean and functional

---

**Good luck, and build responsibly! 🚀**
**🎄 Merry Christmas and a Happy, Prosperous New Year!**
May this season bring growth, creativity, and success in your learning journey.
