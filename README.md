
# Anas Obeidat Hub Backend

This is the Node.js backend for the Anas Obeidat Hub application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/health`: Check server health
- `GET /api/videos`: Get all videos
- `GET /api/videos/:id`: Get a specific video

## Folder Structure

- `server.js`: Main entry point
- `routes/`: API route handlers
- `models/`: Data models (to be added)
- `controllers/`: Business logic (to be added)
- `middleware/`: Custom middleware (to be added)
- `config/`: Configuration files (to be added)
