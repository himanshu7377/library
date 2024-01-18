// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');


// View all books
router.get('/books', bookController.getAllBooks);

// Create a new book
router.post('/books', authMiddleware.checkRole('CREATOR'), bookController.createBook);



// Delete a book
router.delete('/books/:id', authMiddleware.checkRole('CREATOR'), bookController.deleteBook);

// View books created within the last 10 minutes
router.get('/books/new', bookController.getNewBooks);

// View books created beyond the last 10 minutes
router.get('/books/old', bookController.getOldBooks);

module.exports = router;
