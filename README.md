# URL Shortener Backend

A backend service for generating short URLs and tracking detailed click analytics. Built with Node.js, Express, MongoDB, and Redis. The project follows a clean, service-based architecture suitable for scalable, production-level applications.

## Features

### Authentication
- JWT-based authentication
- Zod schema validation
- Secure password hashing with bcrypt
- Protected routes via middleware

### URL Shortening
- Unique short code generation
- Collision handling with regeneration
- Owner-based link creation
- Redirect controller with click logging

### Analytics
- Total clicks
- Clicks grouped by date
- Browser statistics
- Referrer tracking
- Geo lookup (IP → Country)
- AI-generated analytics summary using Groq

### Redis Caching
- Redirect caching for fast URL resolution
- Analytics caching with TTL
- Geo lookup caching for repeated IPs
- Redis-backed rate limiting

### Architecture and Quality
- Controllers kept minimal; logic in dedicated services
- Centralized error handler
- Reusable utilities for JWT, short code, geo lookup, and AI summarization
- Request logging with Morgan
- Secure headers via Helmet

## Project Structure

```
src/
  app.js
  server.js
  config/
  controllers/
  services/
  models/
  routes/
  middlewares/
  utils/
  schemas/
```

## API Endpoints

### Authentication
POST /api/auth/register  
POST /api/auth/login  

### Links
POST /api/link/create  
GET  /api/link/:slug  

### Analytics
GET /api/analytics/:slug  

## Setup

Install dependencies:
```
npm install
```

Create a `.env` file with:
- MongoDB URI  
- JWT secret  
- Redis URL  
- Groq API key  
- Rate limit settings  

Start Redis:
```
redis-server
```

Run the server:
```
npm run dev
```

## Summary

This project implements a complete URL shortening system with analytics, multi-layer caching, geo resolution, and authentication. The structure and implementation follow standard backend engineering practices and are designed for clarity, performance, and maintainability.
