const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = require("../models/bookModel")
const utilities = require("../utils/index")
const { validationResult } = require('express-validator');

const bookController = {};


//Retrieves all books from the database
bookController.getAllBooks = async function (req, res) {
    try {
        const books = await model.find();

        res.status(200).json(books);
    } catch (error) {
        console.error('Error in getAllBooks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Retrieves a single book by it's Id
bookController.getBookById = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const bookId = req.params.bookId;
        const book = await model.findOne({ _id: bookId });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Error in getBookById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Receives ISBN and condition, requests book information from the google books api, creates the bookSchema and saves it to the database
bookController.addBook = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let bookInputs = { ISBN, genre, condition, swap } = req.body
        let requestUri = `https://www.googleapis.com/books/v1/volumes?q=${bookInputs.ISBN}`
        let bookData = await utilities.apiFetch(requestUri)
        let title = bookData.items[0].volumeInfo.title || 'Unknown Title';
        let author = bookData.items[0].volumeInfo.authors[0] || 'Unknown Author';
        let description = bookData.items[0].volumeInfo.description || 'Description not available';
        let newBook = new model({
            title,
            author,
            description,
            genre,
            condition,
            ISBN,
            swap
        });

        await newBook.save()


        res.status(201).json({ message: 'Book added', book: newBook });
    } catch (error) {
        console.error('Error in addBook:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
async function getBookByISBN() {
    async function findBookByISBN(isbn) {
        try {
            const book = await model.findOne({ isbn: isbn });
            return book;
        } catch (error) {
            console.error('Error finding book by ISBN:', error);
            throw error;
        }
    }
}

bookController.updateBook = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { bookId } = req.params;
    try {
        let bookInputs = {
            title,
            author,
            description,
            genre,
            condition,
            ISBN,
            swap
        } = req.body

        // let updatedBook = new model(bookInputs)
        // let completedBook = await model.findOneAndUpdate({ _id: id }, updatedBook, { new: true })
        let completedBook = await model.findOneAndUpdate({ _id: bookId }, bookInputs, { new: true });

        if (!completedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(201).json({ message: 'Book updated', book: completedBook });
    }
    catch (error) {
        console.error('Error in updateBook:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

bookController.deleteBook = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { bookId } = req.params;

        const deletedBook = await model.findByIdAndDelete({ _id: bookId });

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted', book: deletedBook });
    } catch (error) {
        console.error('Error in deleteBook:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = bookController;