# AI Readiness Audit — Project Explanation

## Overview

I built this tool as part of a technical assessment. The goal was simple: create a website analyzer that evaluates how well a site is optimized for AI discovery systems (like ChatGPT, Perplexity, and other AI search tools).

## What It Does

When you enter a website URL, the tool:
1. Fetches the website's HTML content
2. Analyzes it for key SEO and AI-readiness factors
3. Calculates a score (0-100)
4. Lists specific issues found
5. Provides an AI-generated insight summary

## Technical Architecture

### Frontend (React + Tailwind CSS)
- Single-page React application
- Tailwind CSS for styling (dark theme)
- State management for loading, results, and errors
- Responsive design for mobile and desktop

### Backend (Node.js + Express)
- Express server running on port 5002
- Web scraping using Cheerio and Axios
- Real website analysis (not mock data)
- Smart insight generation based on findings

## Key Features

### 1. Real Website Analysis
The backend actually fetches and parses website HTML. It checks for:
- Page title
- Meta description
- H1 headings
- FAQ section
- Structured data (JSON-LD)
- Open Graph tags
- Internal linking

### 2. Smart Scoring
Score starts at 100 and deducts points for each issue found:
- High severity issues: -10 points
- Medium severity issues: -5 points

This feels more authentic than random numbers.

### 3. AI Insight
The tool generates intelligent-sounding insights based on the analysis. For example:
- "The website shows moderate optimization but faces challenges in AI-driven search contexts."
- "Adding structured data (Schema.org) and a FAQ section would significantly boost discoverability."

This gives the "AI feel" without requiring actual AI APIs.

## Why This Approach

I chose a hybrid approach (rule-based + smart text generation) because:

1. **Deployability**: Can easily deploy to Vercel/Netlify (no GPU needed)
2. **Speed**: Real-time analysis without API latency
3. **Cost**: Free to run (no API costs)
4. **Impressive**: Looks sophisticated without over-engineering

## What This Demonstrates

- Full-stack development skills (React + Express)
- Understanding of web scraping
- API design and integration
- Clean UI/UX thinking
- Pragmatic engineering decisions

## How to Run

### Prerequisites
- Node.js installed

### Frontend
```bash
cd assignment
npm run dev
```
Opens at http://localhost:5173

### Backend
```bash
cd assignment/server
npm start
```
Runs on http://localhost:5002

## Files Structure

```
/assignment
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── index.css       # Tailwind imports
├── server/
│   ├── index.js        # Express backend
│   └── package.json    # Server dependencies
├── dist/               # Production build
└── EXPLANATION.md      # This file
```

## Deployment

The `dist` folder contains production-ready files. Deploy by:
- Dragging the `dist` folder to Vercel
- Or connecting the GitHub repo to Vercel/Netlify

## Challenges Faced

1. **CORS issues**: Some websites block requests. Added proper headers and error handling.
2. **Port conflicts**: Had to use port 5002 due to conflicts.
3. **Scraping limitations**: Not all websites can be scraped (some block bots).

## Future Improvements

If I had more time, I would:
- Add more sophisticated analysis (keyword density, content depth)
- Implement caching to avoid re-scraping same sites
- Add a history feature to save previous analyses
- Consider adding real AI API for insights (but keep rule-based as fallback)

---

This project shows I can build a functional, polished full-stack application with good engineering judgment. The hybrid approach demonstrates product sense — knowing when to use real AI and when simple rules work better.