// backend/controllers/bookController.js
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.createBook = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract data from request body
  const { title, author } = req.body;
  const createdBy = req.user.id; // User ID from authentication middleware

  try {
    // Create a new book
    const book = new Book({ title, author, createdBy });

    // Save the book to the database
    await book.save();

    res.status(201).json({ msg: 'Book created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    // Get all books
    const books = await Book.find();

    res.json(books);
    console.log(res)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    // Find and delete the book
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json({ msg: 'Book deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getNewBooks = async (req, res) => {
  try {
    // Get books created within the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const newBooks = await Book.find({ createdAt: { $gte: tenMinutesAgo } });

    res.json(newBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getOldBooks = async (req, res) => {
  try {
    // Get books created beyond the last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const oldBooks = await Book.find({ createdAt: { $lt: tenMinutesAgo } });

    res.json(oldBooks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
