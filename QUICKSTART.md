# Quick Start Guide - Demo Infrastructure

This guide will help you quickly set up and test the Medical Laboratory System with the demo infrastructure.

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- Git

### Option 1: Local Development (No Docker)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the application**
   ```bash
   npm start
   ```

3. **Test the API**
   ```bash
   # In another terminal
   curl http://localhost:3000/health
   curl http://localhost:3000/api/bookings
   ```

4. **Run tests**
   ```bash
   npm test
   npm run test:integration
   ```

### Option 2: Docker Compose (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Check services are running**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Test the API**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/bookings
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## 📝 Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "services": {
    "database": "not_configured",
    "redis": "not_configured"
  }
}
```

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "patientEmail": "john.doe@example.com",
    "patientPhone": "+1234567890",
    "testType": "blood_test",
    "appointmentDate": "2024-12-25T10:00:00.000Z",
    "notes": "Fasting required"
  }'
```

### Get All Bookings
```bash
curl http://localhost:3000/api/bookings
```

### Create a Test Result
```bash
curl -X POST http://localhost:3000/api/tests \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1,
    "testType": "blood_test",
    "result": "All values within normal range",
    "status": "normal",
    "labTechnician": "Dr. Smith"
  }'
```

## 🧪 Running Tests

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Coverage Report
After running tests, check the `coverage/` directory for HTML reports:
```bash
open coverage/lcov-report/index.html  # Mac
start coverage/lcov-report/index.html # Windows
```

## 🔄 Testing the CI/CD Pipeline

### Test Locally with GitHub Actions (using act)

1. **Install act** (GitHub Actions runner)
   ```bash
   # Mac
   brew install act
   
   # Windows (with Chocolatey)
   choco install act-cli
   ```

2. **Run the pipeline locally**
   ```bash
   act push
   ```

### Test on GitHub

1. **Push to a test branch**
   ```bash
   git checkout -b test-ci-cd
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin test-ci-cd
   ```

2. **Create a Pull Request**
   - Go to GitHub repository
   - Create PR from `test-ci-cd` to `main`
   - Watch the pipeline run in the Actions tab

## 🐳 Docker Commands

### Build Docker Image
```bash
docker build -t medical-lab-app:latest .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  medical-lab-app:latest
```

### Run Tests in Container
```bash
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  node:20 \
  npm test
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API information |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| PATCH | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET | `/api/tests` | List all test results |
| POST | `/api/tests` | Create test result |
| GET | `/api/tests/:id` | Get test result by ID |
| PUT | `/api/tests/:id` | Update test result |

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker Issues
```bash
# Reset Docker
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Test Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run tests with verbose output
npm test -- --verbose
```

## 📚 Next Steps

1. **Review the README.md** for full documentation
2. **Check DEPLOYMENT.md** for deployment instructions
3. **Explore the CI/CD pipeline** in `.github/workflows/`
4. **Customize** the application for your needs

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
- Check test files in `tests/` directory for API usage examples

---

**Ready to go!** 🎉 Your demo infrastructure is set up and ready for testing the CI/CD pipeline.

