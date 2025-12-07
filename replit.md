# American British Translator

## Overview
This is a web application that translates text between American and British English. Built as a FreeCodeCamp Quality Assurance project.

## Project Architecture
- **Backend**: Express.js server (Node.js)
  - Translation API endpoint at `/api/translate`
  - Serves static frontend files
- **Frontend**: Vanilla HTML/CSS/JavaScript
  - Text input area for translation
  - Dropdown to select translation direction
  - Displays translated text with highlighted differences

## Key Features
- Translates American English to British English and vice versa
- Handles:
  - Spelling differences (color/colour, favorite/favourite)
  - Vocabulary differences (trash/rubbish, elevator/lift)
  - Title formats (Mr./Mr, Mrs./Mrs)
  - Time formats (12:15/12.15)
- Highlights translated words in the output

## Tech Stack
- Node.js with Express.js
- Nodemon for development
- Mocha/Chai for testing
- Babel for transpilation

## Port Configuration
- Development: Port 5000 (bound to 0.0.0.0)
- Production: Uses autoscale deployment

## Recent Changes (December 7, 2025)
- Configured for Replit environment
- Updated server to bind to 0.0.0.0:5000 for proper proxy support
- Set up workflow for automatic server restart
- Configured deployment settings for production
- Installed all npm dependencies

## File Structure
```
/
├── components/          # Translation logic and dictionaries
│   ├── translator.js    # Main translation class
│   ├── american-only.js
│   ├── british-only.js
│   ├── american-to-british-spelling.js
│   └── american-to-british-titles.js
├── routes/              # API routes
│   ├── api.js           # Translation endpoint
│   └── fcctesting.js    # FCC testing routes
├── views/               # HTML templates
│   └── index.html       # Main frontend
├── public/              # Static assets
│   ├── index.js         # Frontend JavaScript
│   └── style.css        # Styles
├── tests/               # Test suites
│   ├── 1_unit-tests.js
│   └── 2_functional-tests.js
└── server.js            # Express server entry point
```

## Running the Application
The application runs automatically via the configured workflow. To manually restart:
- Use the workflow restart button in Replit

## Testing
Run tests with: `npm test`

## Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (set to 'test' for running tests)
