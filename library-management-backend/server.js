const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'library_management'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Define routes
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Get all books
app.get('/api/books', (req, res) => {
    console.log('Fetching all books');
    db.query('SELECT * FROM books', (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log('Fetched all books successfully');
            console.log(result);
            res.json(result);
        }
    });
});

// Add a new book
app.post('/api/books', (req, res) => {
    console.log('Adding a new book');
    const { title, author, ISBN } = req.body;
    db.query('INSERT INTO books (title, author, ISBN) VALUES (?, ?, ?)', [title, author, ISBN], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, title, author, ISBN });
        }
    });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
    console.log('Updating a book');
    const { title, author, ISBN } = req.body;
    const bookId = req.params.id;
    db.query('UPDATE books SET title=?, author=?, ISBN=? WHERE id=?', [title, author, ISBN, bookId], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: bookId, title, author, ISBN });
        }
    });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
    console.log('Deleting a book');
    const bookId = req.params.id;
    db.query('DELETE FROM books WHERE id=?', [bookId], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Book deleted successfully' });
        }
    });
});
