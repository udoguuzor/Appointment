# Appointment Booking System API Documentation

## Base Information

- **Base URL (Development)**: `http://localhost:3000`
- **Base URL (Production)**: `https://appointment-6gts.onrender.com`
- **API Version**: v1
- **Authentication**: JWT Bearer Tokens

### Authentication Header
```http
Authorization: Bearer <your_access_token>
Content-Type
All requests with a body should use:

http
Content-Type: application/json
Date/Time Format
All dates and times must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).

Example: 2026-06-20T09:00:00Z (UTC time)

Response Formats
Success Response
json
{
  "status": 200,
  "message": "A descriptive message",
  "data": { ... }
}
Error Response
json
{
  "status": 400,
  "message": "Error description",
  "error": "Detailed error message"
}
HTTP Status Codes
Code	Description
200	Success
201	Created
400	Bad Request (validation errors)
401	Unauthorized (invalid or missing token)
403	Forbidden (insufficient permissions)
404	Not Found
500	Internal Server Error
Quick Start Guide
Register: POST /signup

Login: POST /login (get access token)

Set Authorization Header: Authorization: Bearer <access_token>

Make API calls: Use the token for all protected endpoints

1. Authentication & Users
Health Check
Endpoint: GET /health

Auth Required: No

Request Payload: None

Response:

json
{
  "status": 200,
  "message": "Server is running",
  "data": {
    "uptime": "2h 30m",
    "database": "connected"
  }
}



REGISTER A USER

Endpoint: POST /signup

Auth Required: No

Request:

json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}


Response:

json
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


LOGIN
Endpoint: POST /login

Auth Required: No

Request:

json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}


Response:

json
{
  "status": 200,
  "message": "johndoe has logged in...",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
}


LOGOUT
Endpoint: POST /logout

Auth Required: Yes

Request:

json
{
  "userId": 1
}

Response:

json
{
  "status": 200,
  "message": "johndoe has logged out successfully...",
  "data": { "id": 1, "username": "johndoe" }
}


CHANGE PASSWORD
Endpoint: POST /changePassword

Auth Required: Yes

Request:

json
{
  "email": "johndoe@example.com",
  "oldPassword": "securepassword",
  "newPassword": "newsecurepassword"
}


Response:

json
{
  "status": 200,
  "message": "johndoe has changed password successfully...",
  "data": { "id": 1, "username": "johndoe", "email": "johndoe@example.com" }
}


REFRESH TOKEN
Endpoint: POST /new-access-token

Auth Required: No

Request:

json
{
  "refreshToken": "your_refresh_token_here"
}


Response:

json
{
  "status": 200,
  "message": "Access token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}


FORGOT PASSWORD
Endpoint: POST /forgot-password

Auth Required: No

Request:

json
{
  "email": "johndoe@example.com"
}


Response:

json
{
  "status": 200,
  "message": "Password reset email sent",
  "data": null
}
RESET PASSWORD
Endpoint: POST /reset-password

Auth Required: No

Request:

json
{
  "token": "hex_token_from_email",
  "newPassword": "newsecurepassword"
}


Response:

json
{
  "status": 200,
  "message": "Password has been reset successfully",
  "data": null
}



2. SERVICE

CREATE SERVICE

Endpoint: POST /createService

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request:

json
{
  "name": "Guitar Lesson",
  "description": "One-on-one acoustic guitar lesson",
  "duration": 60,
  "userId": 1,
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "12:00"
    }
  ]
}
Note: dayOfWeek is 0=Sunday to 6=Saturday. startTime and endTime are 24-hour strings "HH:MM"

Response:

json
{
  "status": 201,
  "message": "Service Guitar Lesson created successfully",
  "data": {
    "id": "cuid_string",
    "name": "Guitar Lesson",
    "description": "One-on-one acoustic guitar lesson",
    "duration": 60,
    "userId": 1
  }
}

GET SERVICE INFO

Endpoint: GET /getServiceInfo/:id

Auth Required: Yes

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Service info retrieved successfully",
  "data": {
    "id": "cuid_string",
    "name": "Guitar Lesson",
    "description": "...",
    "duration": 60,
    "userId": 1,
    "availability": [
      {
        "id": "cuid_string",
        "dayOfWeek": "Monday",
        "startTime": "09:00",
        "endTime": "12:00"
      }
    ]
  }
}


GET ALL SERVICES
Endpoint: GET /services

Auth Required: No

Request: None

Response:

json
{
  "status": 200,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": "cuid_string",
      "name": "Guitar Lesson",
      "description": "...",
      "duration": 60,
      "userId": 1
    }
  ]
}



DELETE SERVICES

Endpoint: DELETE /closeService/:id

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Service deleted successfully",
  "data": { "id": "cuid_string", "name": "Guitar Lesson" }
}



3. BOOKINGS

CREATE BOKKINGS

Endpoint: POST /booking

Auth Required: Yes

Request:

json
{
  "userId": 1,
  "serviceId": "service_id_here",
  "startTime": "2026-06-20T09:00:00Z",
  "endTime": "2026-06-20T10:00:00Z"
}

Response:

json
{
  "status": 201,
  "message": "Booking created successfully",
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


GET ALL BOOKINGS
Endpoint: GET /bookings

Auth Required: Yes

Request: None

Response:

json
{
  "status": 200,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": "cuid_string",
      "serviceId": "service_id_here",
      "userId": 1,
      "startTime": "2026-06-20T09:00:00.000Z",
      "endTime": "2026-06-20T10:00:00.000Z",
      "status": "PENDING"
    }
  ]
}


GET BOOKING BY ID
Endpoint: GET /booking/:id

Auth Required: Yes

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking retrieved successfully",
  "data": {
    "id": "cuid_string",
    "serviceId": "service_id_here",
    "userId": 1,
    "startTime": "2026-06-20T09:00:00.000Z",
    "endTime": "2026-06-20T10:00:00.000Z",
    "status": "PENDING"
  }
}


ACCEPT BOOKING

Endpoint: PUT /booking/:id/accept

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking accepted",
  "data": { "id": "cuid_string", "status": "CONFIRMED" }
}


CANCEL BOOKING

Endpoint: PUT /booking/:id/cancel

Auth Required: Yes (Both USER and SERVICE_PROVIDER)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking cancelled",
  "data": { "id": "cuid_string", "status": "CANCELLED" }
}


COMPLETE BOOKING

Endpoint: PUT /booking/:id/completed

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking marked as completed",
  "data": { "id": "cuid_string", "status": "COMPLETED" }
}


REJECT BOOKING
Endpoint: PUT /booking/:id/reject

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking rejected",
  "data": { "id": "cuid_string", "status": "REJECTED" }
}


MARK MISSED BOOKING

Endpoint: PUT /booking/:id/missed

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None (URL param: id)

Response:

json
{
  "status": 200,
  "message": "Booking marked as missed",
  "data": { "id": "cuid_string", "status": "MISSED" }
}


RESCHEDULE BOOKING
Endpoint: PUT /booking/:id/reschedule

Auth Required: Yes

Request:

json
{
  "newStartTime": "2026-06-21T10:00:00Z",
  "newEndTime": "2026-06-21T11:00:00Z"
}
Response:

json
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


4. DASHBOARDS

GET SERVICE CALENDAR
Endpoint: GET /dashboard/calendar/:serviceId?startDate=2026-06-01&endDate=2026-06-30

Auth Required: No

Request: None (Uses Query Params)

Response:

json
{
  "status": 200,
  "message": "Calendar fetched successfully",
  "data": {
    "serviceName": "Guitar Lesson",
    "duration": 60,
    "availability": [
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


GET PROVIDER DASHBOARD
Endpoint: GET /dashboard/provider

Auth Required: Yes (Must have SERVICE_PROVIDER role)

Request: None

Response:

json
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

GET USER DASHBOARD
Endpoint: GET /dashboard/user

Auth Required: Yes (Must have USER role)

Request: None

Response:

json
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
