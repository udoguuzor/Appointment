# Appointment Booking System - Architecture & Flow

Welcome to the Appointment Booking System! This document is written specifically for beginners to understand how the entire application connects and functions behind the scenes. 

---

## 1. High-Level Architecture

This project uses a standard modern backend architecture consisting of **Node.js, Express.js, PostgreSQL, and Prisma ORM**.

*   **Node.js & Express:** The web server that receives HTTP requests from the frontend, processes them, and sends back JSON responses.
*   **PostgreSQL:** The relational database where all our data (Users, Bookings, Services) is permanently stored.
*   **Prisma ORM (Object-Relational Mapping):** A tool that allows us to interact with the PostgreSQL database using simple JavaScript/TypeScript code instead of writing raw SQL queries.

---

## 2. Folder Structure

Here is what every folder in the `src` directory does:

*   **`route/`**: The "traffic cops". They take an incoming URL request (like `/signup`) and route it to the correct controller.
*   **`controller/`**: The "brains". They handle the actual business logic—checking if the user exists, validating passwords, sending emails, etc.
*   **`model/`**: The "database interactors". They contain the helper functions that use Prisma to save or fetch data from PostgreSQL.
*   **`middleware/`**: The "bouncers". Functions that run *before* the controller to verify things (e.g., checking if the user's JWT token is valid and ensuring they have the correct role).
*   **`config/`**: Contains database connection initialization (`db.js`).
*   **`utils/`**: Helper scripts, like `email.js`, which handles sending automated notifications.

---

## 3. The Request Flow (How Everything Connects)

When the frontend makes a request to the backend, it follows a strict path:

1.  **Request arrives at `app.js`**: The main entry point of the server.
2.  **Forwarded to `route/router.js`**: The main router figures out which specific route file (`booking.route.js`, `user.route.js`) needs to handle this.
3.  **Middleware executes**: For example, if it's a protected route, `authMiddleware.js` checks the `Authorization` header. If the token is invalid, the request is stopped here.
4.  **Controller Executes**: The route forwards the request to the specific Controller (e.g., `booking.controller.js`).
5.  **Model & Database Execution**: The controller calls Prisma (sometimes via the `model/` folder) to find, create, or update data in PostgreSQL.
6.  **Response Handler**: Finally, the controller uses `responseHandler.js` to send a neatly formatted JSON response back to the frontend.

---

## 4. The Database Schema Connectors

How does the data relate to each other?

*   **User:** Can be a `USER` (Student/Client) or a `SERVICE_PROVIDER`.
*   **Service:** Created by a `User` (who is a Provider). It holds the name and duration of the appointment (e.g., "Guitar Lesson", 60 minutes).
*   **Avaliability:** Attached to a `Service`. It dictates which days and times the service is available.
*   **Booking:** Created by a `User` (Student), targeting a specific `Service`. It has a `startTime`, `endTime`, and a `status` (`PENDING`, `CONFIRMED`, `CANCELLED`, etc.).

---

## 5. Example Flow: Booking an Appointment

1.  **Frontend** sends a `POST /booking` request with `serviceId`, `userId`, `startTime`, and `endTime`.
2.  **`authMiddleware.js`** verifies the user is logged in.
3.  **`booking.controller.js`** checks if the `serviceId` exists.
4.  **`booking.controller.js`** checks if the `startTime` falls within the `Avaliability` schedule of the Service.
5.  **`booking.controller.js`** checks if the time slot is already taken by another booking.
6.  **Prisma** creates a new `Booking` row in the database with status `PENDING`.
7.  **`email.js`** sends an automated confirmation email to the user.
8.  **Frontend** receives a success JSON response and shows a "Booking successful!" popup.
