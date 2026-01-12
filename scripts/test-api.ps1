# API Testing Script for Medical Laboratory System (PowerShell)
# This script tests all API endpoints

$BaseUrl = "http://localhost:3000"
$ErrorActionPreference = "Stop"

Write-Host "🧪 Testing Medical Laboratory System API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test Health Endpoint
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
    Write-Host "✅ Health check passed" -ForegroundColor Green
    $healthResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test Root Endpoint
Write-Host "2. Testing Root Endpoint..." -ForegroundColor Yellow
try {
    $rootResponse = Invoke-RestMethod -Uri "$BaseUrl/" -Method Get
    $rootResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Root endpoint failed: $_" -ForegroundColor Red
}
Write-Host ""

# Create a Booking
Write-Host "3. Creating a Test Booking..." -ForegroundColor Yellow
$tomorrow = (Get-Date).AddDays(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.000Z")
$bookingData = @{
    patientName = "Test Patient"
    patientEmail = "test@example.com"
    patientPhone = "+1234567890"
    testType = "blood_test"
    appointmentDate = $tomorrow
    notes = "API test booking"
} | ConvertTo-Json

try {
    $bookingResponse = Invoke-RestMethod -Uri "$BaseUrl/api/bookings" -Method Post -Body $bookingData -ContentType "application/json"
    $bookingId = $bookingResponse.data.id
    Write-Host "✅ Booking created successfully (ID: $bookingId)" -ForegroundColor Green
    $bookingResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to create booking: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Get All Bookings
Write-Host "4. Retrieving All Bookings..." -ForegroundColor Yellow
try {
    $allBookings = Invoke-RestMethod -Uri "$BaseUrl/api/bookings" -Method Get
    $allBookings | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to retrieve bookings: $_" -ForegroundColor Red
}
Write-Host ""

# Get Specific Booking
Write-Host "5. Retrieving Booking by ID..." -ForegroundColor Yellow
try {
    $booking = Invoke-RestMethod -Uri "$BaseUrl/api/bookings/$bookingId" -Method Get
    $booking | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to retrieve booking: $_" -ForegroundColor Red
}
Write-Host ""

# Update Booking Status
Write-Host "6. Updating Booking Status..." -ForegroundColor Yellow
$statusData = @{ status = "confirmed" } | ConvertTo-Json
try {
    $updatedBooking = Invoke-RestMethod -Uri "$BaseUrl/api/bookings/$bookingId/status" -Method Patch -Body $statusData -ContentType "application/json"
    $updatedBooking | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to update booking: $_" -ForegroundColor Red
}
Write-Host ""

# Create Test Result
Write-Host "7. Creating Test Result..." -ForegroundColor Yellow
$testData = @{
    bookingId = $bookingId
    testType = "blood_test"
    result = "All values within normal range"
    status = "normal"
    labTechnician = "Dr. Test"
    notes = "API test result"
} | ConvertTo-Json

try {
    $testResponse = Invoke-RestMethod -Uri "$BaseUrl/api/tests" -Method Post -Body $testData -ContentType "application/json"
    $testId = $testResponse.data.id
    Write-Host "✅ Test result created successfully (ID: $testId)" -ForegroundColor Green
    $testResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to create test result: $_" -ForegroundColor Red
}
Write-Host ""

# Get All Test Results
Write-Host "8. Retrieving All Test Results..." -ForegroundColor Yellow
try {
    $allTests = Invoke-RestMethod -Uri "$BaseUrl/api/tests" -Method Get
    $allTests | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to retrieve test results: $_" -ForegroundColor Red
}
Write-Host ""

# Get Test Result by Booking ID
Write-Host "9. Retrieving Test Results by Booking ID..." -ForegroundColor Yellow
try {
    $testsByBooking = Invoke-RestMethod -Uri "$BaseUrl/api/tests?bookingId=$bookingId" -Method Get
    $testsByBooking | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Failed to retrieve test results: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ All API tests completed!" -ForegroundColor Green

