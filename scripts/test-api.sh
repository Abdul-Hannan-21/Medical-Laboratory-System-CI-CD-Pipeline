#!/bin/bash

# API Testing Script for Medical Laboratory System
# This script tests all API endpoints

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing Medical Laboratory System API"
echo "========================================"
echo ""

# Test Health Endpoint
echo "1. Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "$BODY" | jq .
else
    echo -e "${RED}❌ Health check failed (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
echo ""

# Test Root Endpoint
echo "2. Testing Root Endpoint..."
curl -s "${BASE_URL}/" | jq .
echo ""

# Create a Booking
echo "3. Creating a Test Booking..."
BOOKING_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "patientEmail": "test@example.com",
    "patientPhone": "+1234567890",
    "testType": "blood_test",
    "appointmentDate": "'$(date -u -v+1d +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -d "+1 day" +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "notes": "API test booking"
  }')

BOOKING_ID=$(echo "$BOOKING_RESPONSE" | jq -r '.data.id')
if [ "$BOOKING_ID" != "null" ] && [ -n "$BOOKING_ID" ]; then
    echo -e "${GREEN}✅ Booking created successfully (ID: $BOOKING_ID)${NC}"
    echo "$BOOKING_RESPONSE" | jq .
else
    echo -e "${RED}❌ Failed to create booking${NC}"
    echo "$BOOKING_RESPONSE" | jq .
    exit 1
fi
echo ""

# Get All Bookings
echo "4. Retrieving All Bookings..."
curl -s "${BASE_URL}/api/bookings" | jq .
echo ""

# Get Specific Booking
echo "5. Retrieving Booking by ID..."
curl -s "${BASE_URL}/api/bookings/${BOOKING_ID}" | jq .
echo ""

# Update Booking Status
echo "6. Updating Booking Status..."
curl -s -X PATCH "${BASE_URL}/api/bookings/${BOOKING_ID}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}' | jq .
echo ""

# Create Test Result
echo "7. Creating Test Result..."
TEST_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/tests" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": '${BOOKING_ID}',
    "testType": "blood_test",
    "result": "All values within normal range",
    "status": "normal",
    "labTechnician": "Dr. Test",
    "notes": "API test result"
  }')

TEST_ID=$(echo "$TEST_RESPONSE" | jq -r '.data.id')
if [ "$TEST_ID" != "null" ] && [ -n "$TEST_ID" ]; then
    echo -e "${GREEN}✅ Test result created successfully (ID: $TEST_ID)${NC}"
    echo "$TEST_RESPONSE" | jq .
else
    echo -e "${RED}❌ Failed to create test result${NC}"
    echo "$TEST_RESPONSE" | jq .
fi
echo ""

# Get All Test Results
echo "8. Retrieving All Test Results..."
curl -s "${BASE_URL}/api/tests" | jq .
echo ""

# Get Test Result by Booking ID
echo "9. Retrieving Test Results by Booking ID..."
curl -s "${BASE_URL}/api/tests?bookingId=${BOOKING_ID}" | jq .
echo ""

echo -e "${GREEN}✅ All API tests completed!${NC}"

