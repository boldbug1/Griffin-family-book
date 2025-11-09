const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from root directory

// Initialize database
const db = new Database('comments.db');

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_page TEXT NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        comment_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_character_page ON comments(character_page);
    CREATE INDEX IF NOT EXISTS idx_created_at ON comments(created_at);
`);

// Helper function to validate Gmail email
function isValidGmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return emailRegex.test(email);
}

// API Routes

// Login/Register endpoint (just validates Gmail, no real auth)
app.post('/api/login', (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    if (!isValidGmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid Gmail address' });
    }

    try {
        // Check if user exists
        let user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);
        
        if (!user) {
            // Create new user
            const insert = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)');
            insert.run(username, email);
            user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        }

        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Get comments for a character page
app.get('/api/comments/:characterPage', (req, res) => {
    const { characterPage } = req.params;
    
    try {
        const comments = db.prepare(`
            SELECT c.*, u.username 
            FROM comments c
            JOIN users u ON c.username = u.username
            WHERE c.character_page = ?
            ORDER BY c.created_at DESC
        `).all(characterPage);
        
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Post a new comment
app.post('/api/comments', (req, res) => {
    const { characterPage, username, email, commentText } = req.body;

    if (!characterPage || !username || !email || !commentText) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidGmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid Gmail address' });
    }

    // Verify user exists
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND email = ?').get(username, email);
    if (!user) {
        return res.status(401).json({ error: 'User not found. Please login again.' });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO comments (character_page, username, email, comment_text)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = insert.run(characterPage, username, email, commentText);
        
        // Get the created comment with timestamp
        const comment = db.prepare(`
            SELECT c.*, u.username 
            FROM comments c
            JOIN users u ON c.username = u.username
            WHERE c.id = ?
        `).get(result.lastInsertRowid);
        
        res.json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

