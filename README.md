# GriffinPedia

A Family Guy character encyclopedia with a commenting system.

## Features

- Browse character profiles (Peter, Lois, Stewie, Meg, Chris, Brian)
- View and post comments on character pages
- User authentication with Gmail validation
- Persistent comment storage with timestamps
- Responsive design with smooth animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Seed Initial Bot Comments (Optional)

To add initial bot comments to the database:

```bash
npm run seed
```

### 4. Open in Browser

Navigate to `http://localhost:3000` in your web browser.

## Usage

1. **Login**: When you first visit the site, you'll be prompted to enter a username and Gmail address. The system validates that the email is a Gmail address.

2. **Browse Characters**: Use the arrow buttons or keyboard arrows to navigate between character pages.

3. **View Comments**: Comments are displayed beneath each character image with usernames and timestamps.

4. **Post Comments**: Type a comment in the input field and click "Post" or press Enter to submit.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **Fonts**: Inter (Google Fonts)

## API Endpoints

- `POST /api/login` - Login/Register user (validates Gmail)
- `GET /api/comments/:characterPage` - Get comments for a character
- `POST /api/comments` - Post a new comment

## Notes

- Comments are stored in a SQLite database (`comments.db`)
- User information is stored in localStorage on the client side
- Gmail validation is performed on both client and server side
- No real authentication - just username/email validation
