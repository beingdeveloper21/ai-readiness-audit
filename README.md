# AI Readiness Audit

A web tool that analyzes websites for AI discoverability. Enter a URL and get an AI Readiness Score with actionable insights.

## Features

- Real website analysis using web scraping
- AI Readiness Score (0-100)
- Specific issues found with severity levels
- AI-generated insight summary
- Clean, modern UI with dark theme

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Scraping**: Cheerio + Axios

## Getting Started

### Prerequisites
- Node.js installed

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd server && npm start
```
Server runs on http://localhost:5002

**Terminal 2 - Frontend:**
```bash
npm run dev
```
App opens at http://localhost:5173

## Deployment

### Vercel (Frontend only)
1. Go to vercel.com
2. Drag the `dist` folder to deploy
3. Or connect your GitHub repo

### Render (Backend)
1. Push code to GitHub
2. Connect repo to Render
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`

## Project Structure

```
├── src/              # React frontend
├── server/           # Express backend
├── dist/             # Production build
└── EXPLANATION.md    # Project details
```

## License

MIT