# Appointment Booking System API Documentation

This documentation details all the available endpoints, required request payloads, headers, and exact expected response payloads for the frontend developers to integrate the API smoothly.

## Base Information

- **Base URL**: `http://localhost:<PORT>` (Default usually `3000` or `5000`)
- **Authentication**: JWT Bearer Tokens. Most protected endpoints require an `Authorization` header.
  ```http
  Authorization: Bearer <your_access_token>
  ```
- **Content-Type**: All requests with a body should use `Content-Type: application/json`.
- **Standard Response Format**: All successful responses are wrapped in a standard object:
  ```json
  {
    "status": 200,
    "message": "A descriptive message",
    "data": { ... } // The actual payload requested
  }
  ```

---

## 1. Authentication & Users (`/`)

### Register a User
- **Endpoint**: `POST /signup`
- **Auth Required**: No
- **Request Payload**:
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "johndoe has registered...",
    "data": {
      "id": 1,
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "USER",
      "createdAt": "2026-06-15T12:00:00.000Z"
    }
  }
  ```

### Login
- **Endpoint**: `POST /login`
- **Auth Required**: No
- **Request Payload**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "johndoe has logged in...",
    "data": {
      "message": "johndoe has logged.",
      "tokens": {
        "accessToken": "eyJhbGciOi...",
        "refreshtoken": "eyJhbGciOi..."
      },
      "fromTokenDB": { "storingToken": { /* Token record DB info */ } }
    }
  }
  ```

### Logout
- **Endpoint**: `POST /logout`
- **Auth Required**: Yes
- **Request Payload**:
  ```json
  {
    "userId": 1
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "johndoe has logged out successfully...",
    "data": { "id": 1, "username": "johndoe" }
  }
  ```

### Change Password
- **Endpoint**: `POST /changePassword`
- **Auth Required**: Yes
- **Request Payload**:
  ```json
  {
    "email": "johndoe@example.com",
    "oldPassword": "securepassword",
    "newPassword": "newsecurepassword"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "johndoe has changed password successfully...",
    "data": { "id": 1, "username": "johndoe", "email": "johndoe@example.com" }
  }
  ```

### Refresh Token
- **Endpoint**: `POST /new-access-token`
- **Auth Required**: No
- **Request Payload**:
  ```json
  {
    "refreshToken": "your_refresh_token_here"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Access token generated successfully",
    "data": {
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

### Forgot Password
- **Endpoint**: `POST /forgot-password`
- **Auth Required**: No
- **Request Payload**:
  ```json
  {
    "email": "johndoe@example.com"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Password reset email sent",
    "data": null
  }
  ```

### Reset Password
- **Endpoint**: `POST /reset-password`
- **Auth Required**: No
- **Request Payload**:
  ```json
  {
    "token": "hex_token_from_email",
    "newPassword": "newsecurepassword"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Password has been reset successfully",
    "data": null
  }
  ```

---

## 2. Services (`/`)

### Create Service
- **Endpoint**: `POST /createService`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**:
  ```json
  {
    "name": "Guitar Lesson",
    "description": "One-on-one acoustic guitar lesson",
    "duration": 60,
    "userId": 1,
    "avaliability": [
      {
        "dayOfWeek": 1, 
        "startTime": "09:00",
        "endTime": "12:00"
      }
    ]
  }
  ```
  *(Note: `dayOfWeek` is 0=Sunday to 6=Saturday. `startTime` and `endTime` are 24-hour strings "HH:MM")*
- **Response Payload**:
  ```json
  {
    "status": 201,
    "message": "A service named Guitar Lesson has been created and is now a SERVICE_PROVIDER provider",
    "data": {
      "newService": {
        "id": "cuid_string",
        "name": "Guitar Lesson",
        "description": "One-on-one acoustic guitar lesson",
        "duration": 60,
        "userId": 1
      },
      "userRole": { "id": 1, "role": "SERVICE_PROVIDER" }
    }
  }
  ```

### Get Service Info
- **Endpoint**: `GET /getServiceInfo/:id`
- **Auth Required**: Yes
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "This is the info for --> Guitar Lesson",
    "data": {
      "id": "cuid_string",
      "name": "Guitar Lesson",
      "description": "...",
      "duration": 60,
      "userId": 1,
      "avaliability": [
        {
          "id": "cuid_string",
          "dayOfWeek": "Monday",
          "startTime": "09:00",
          "endTime": "12:00"
        }
      ]
    }
  }
  ```

### Close/Delete Service
- **Endpoint**: `DELETE /closeService/:id`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Service Guitar Lesson has been deleted",
    "data": {
      "id": "cuid_string",
      "name": "Guitar Lesson"
    }
  }
  ```

---

## 3. Bookings (`/`)

### Create Booking
- **Endpoint**: `POST /booking`
- **Auth Required**: Yes
- **Request Payload**:
  ```json
  {
    "userId": 1,
    "serviceId": "service_id_here",
    "startTime": "2026-06-20T09:00:00Z",
    "endTime": "2026-06-20T10:00:00Z"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 201,
    "message": "You have been booked by 2026-06-20T09:00:00Z to 2026-06-20T10:00:00Z",
    "data": {
      "id": "cuid_string",
      "serviceId": "service_id_here",
      "userId": 1,
      "startTime": "2026-06-20T09:00:00.000Z",
      "endTime": "2026-06-20T10:00:00.000Z",
      "status": "PENDING",
      "createdAt": "2026-06-15T12:00:00.000Z",
      "updatedAt": "2026-06-15T12:00:00.000Z"
    }
  }
  ```

### Accept Booking
- **Endpoint**: `PUT /booking/:id/accept`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking accepted",
    "data": {
      "id": "cuid_string",
      "status": "CONFIRMED"
    }
  }
  ```

### Cancel Booking
- **Endpoint**: `PUT /booking/:id/cancel`
- **Auth Required**: Yes (Both `USER` and `SERVICE_PROVIDER`)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking cancelled",
    "data": { "id": "cuid_string", "status": "CANCELLED" }
  }
  ```

### Complete Booking
- **Endpoint**: `PUT /booking/:id/completed`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking marked as completed",
    "data": { "id": "cuid_string", "status": "COMPLETED" }
  }
  ```

### Reject Booking
- **Endpoint**: `PUT /booking/:id/reject`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking rejected",
    "data": { "id": "cuid_string", "status": "REJECTED" }
  }
  ```

### Mark Missed Booking
- **Endpoint**: `PUT /booking/:id/missed`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking marked as missed",
    "data": { "id": "cuid_string", "status": "MISSED" }
  }
  ```

### Reschedule Booking
- **Endpoint**: `PUT /booking/:id/reschedule`
- **Auth Required**: Yes
- **Request Payload**:
  ```json
  {
    "newStartTime": "2026-06-21T10:00:00Z",
    "newEndTime": "2026-06-21T11:00:00Z"
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Booking rescheduled",
    "data": {
      "id": "cuid_string",
      "startTime": "2026-06-21T10:00:00.000Z",
      "endTime": "2026-06-21T11:00:00.000Z",
      "status": "CONFIRMED"
    }
  }
  ```

---

## 4. Dashboards (`/dashboard`)

### Get Service Calendar
- **Endpoint**: `GET /dashboard/calendar/:serviceId?startDate=2026-06-01&endDate=2026-06-30`
- **Auth Required**: No
- **Request Payload**: None (Uses Query Params `startDate` and `endDate`)
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Calendar fetched successfully",
    "data": {
      "serviceName": "Guitar Lesson",
      "duration": 60,
      "avaliability": [
        { "dayOfWeek": 1, "startTime": "09:00", "endTime": "12:00" }
      ],
      "bookings": [
        {
          "id": "cuid_string",
          "startTime": "2026-06-20T09:00:00.000Z",
          "endTime": "2026-06-20T10:00:00.000Z",
          "status": "CONFIRMED"
        }
      ]
    }
  }
  ```

### Get Provider Dashboard
- **Endpoint**: `GET /dashboard/provider`
- **Auth Required**: Yes (Must have `SERVICE_PROVIDER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "Provider dashboard fetched",
    "data": {
      "totalBookings": 15,
      "upcomingBookings": [
        { "id": "cuid_string", "startTime": "...", "status": "CONFIRMED" }
      ],
      "pendingBookings": [
        { "id": "cuid_string", "startTime": "...", "status": "PENDING" }
      ],
      "servicesCount": 2
    }
  }
  ```

### Get User Dashboard
- **Endpoint**: `GET /dashboard/user`
- **Auth Required**: Yes (Must have `USER` role)
- **Request Payload**: None
- **Response Payload**:
  ```json
  {
    "status": 200,
    "message": "User dashboard fetched",
    "data": {
      "upcoming": [
        { "id": "cuid_string", "startTime": "...", "status": "CONFIRMED" }
      ],
      "past": [
        { "id": "cuid_string", "startTime": "...", "status": "COMPLETED" }
      ]
    }
  }
  ```
