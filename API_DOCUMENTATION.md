# API Documentation - Medical Laboratory System

## Base URL
```
http://localhost:3000 (development)
https://medical-lab.example.com (production)
```

## Authentication
Currently, the demo application does not require authentication. In production, implement JWT-based authentication.

## Endpoints

### Health Check

#### GET `/health`
Check the health status of the application and its dependencies.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Degraded (some services unavailable)

---

### Root

#### GET `/`
Get API information.

**Response:**
```json
{
  "message": "Medical Laboratory Test Booking and Result Management System API",
  "version": "1.0.0",
  "documentation": "/api/docs"
}
```

---

### Bookings

#### GET `/api/bookings`
Get all bookings.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "patientName": "John Doe",
      "patientEmail": "john.doe@example.com",
      "patientPhone": "+1234567890",
      "testType": "blood_test",
      "appointmentDate": "2024-12-25T10:00:00.000Z",
      "status": "pending",
      "notes": "Fasting required",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/bookings/:id`
Get a specific booking by ID.

**Parameters:**
- `id` (path) - Booking ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientName": "John Doe",
    "patientEmail": "john.doe@example.com",
    "patientPhone": "+1234567890",
    "testType": "blood_test",
    "appointmentDate": "2024-12-25T10:00:00.000Z",
    "status": "pending",
    "notes": "Fasting required",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Booking not found

#### POST `/api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "patientName": "John Doe",
  "patientEmail": "john.doe@example.com",
  "patientPhone": "+1234567890",
  "testType": "blood_test",
  "appointmentDate": "2024-12-25T10:00:00.000Z",
  "notes": "Fasting required"
}
```

**Validation:**
- `patientName`: String, 3-100 characters, required
- `patientEmail`: Valid email address, required
- `patientPhone`: Phone number format, required
- `testType`: One of: `blood_test`, `urine_test`, `xray`, `mri`, `ct_scan`, `ultrasound`, `biopsy`, required
- `appointmentDate`: Future date (ISO 8601), required
- `notes`: String, max 500 characters, optional

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "patientName": "John Doe",
    "patientEmail": "john.doe@example.com",
    "patientPhone": "+1234567890",
    "testType": "blood_test",
    "appointmentDate": "2024-12-25T10:00:00.000Z",
    "status": "pending",
    "notes": "Fasting required",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error

#### PATCH `/api/bookings/:id/status`
Update booking status.

**Parameters:**
- `id` (path) - Booking ID

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Statuses:**
- `pending`
- `confirmed`
- `completed`
- `cancelled`

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated",
  "data": {
    "id": 1,
    "status": "confirmed",
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid status
- `404` - Booking not found

#### DELETE `/api/bookings/:id`
Delete a booking.

**Parameters:**
- `id` (path) - Booking ID

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Booking not found

---

### Test Results

#### GET `/api/tests`
Get all test results.

**Query Parameters:**
- `bookingId` (optional) - Filter by booking ID
- `status` (optional) - Filter by status (`normal`, `abnormal`, `critical`)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "testType": "blood_test",
      "result": "All values within normal range",
      "status": "normal",
      "notes": "Patient completed test successfully",
      "labTechnician": "Dr. Smith",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/api/tests/:id`
Get a specific test result by ID.

**Parameters:**
- `id` (path) - Test result ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "testType": "blood_test",
    "result": "All values within normal range",
    "status": "normal",
    "notes": "Patient completed test successfully",
    "labTechnician": "Dr. Smith",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Test result not found

#### POST `/api/tests`
Create a new test result.

**Request Body:**
```json
{
  "bookingId": 1,
  "testType": "blood_test",
  "result": "All values within normal range",
  "status": "normal",
  "notes": "Patient completed test successfully",
  "labTechnician": "Dr. Smith"
}
```

**Validation:**
- `bookingId`: Positive integer, required
- `testType`: String, required
- `result`: String, required
- `status`: One of: `normal`, `abnormal`, `critical`, required
- `notes`: String, max 1000 characters, optional
- `labTechnician`: String, 3-100 characters, required

**Response:**
```json
{
  "success": true,
  "message": "Test result created successfully",
  "data": {
    "id": 1,
    "bookingId": 1,
    "testType": "blood_test",
    "result": "All values within normal range",
    "status": "normal",
    "notes": "Patient completed test successfully",
    "labTechnician": "Dr. Smith",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error

#### PUT `/api/tests/:id`
Update a test result.

**Parameters:**
- `id` (path) - Test result ID

**Request Body:** (same as POST)

**Response:**
```json
{
  "success": true,
  "message": "Test result updated successfully",
  "data": {
    ...
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `404` - Test result not found

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Window**: 15 minutes (configurable)
- **Max Requests**: 100 per IP address (configurable)

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Example Usage

### Using cURL

```bash
# Create a booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "patientEmail": "john.doe@example.com",
    "patientPhone": "+1234567890",
    "testType": "blood_test",
    "appointmentDate": "2024-12-25T10:00:00.000Z"
  }'
```

### Using JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    patientName: 'John Doe',
    patientEmail: 'john.doe@example.com',
    patientPhone: '+1234567890',
    testType: 'blood_test',
    appointmentDate: '2024-12-25T10:00:00.000Z'
  })
});

const data = await response.json();
console.log(data);
```

## Testing Scripts

Use the provided test scripts to verify all endpoints:
- **Bash/Unix**: `./scripts/test-api.sh`
- **PowerShell**: `./scripts/test-api.ps1`

Make sure the server is running before executing these scripts.

