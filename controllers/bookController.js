const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = require("../models/bookModel")
const utilities = require("../utils/index")

const bookFunctions = {};

//Receives ISBN and condition, requests book information from the google books api, creates the bookSchema and saves it to the database
bookFunctions.addBook = async function (req, res) {
    try {
        let bookInputs = { ISBN, condition, swap } = req.body
        let requestUri = `https://www.googleapis.com/books/v1/volumes?q=${bookInputs.ISBN}`
        let bookData = await utilities.apiFetch(requestUri)
        let title = bookData.items[0].volumeInfo.title || 'Unknown Title';
        let author = bookData.items[0].volumeInfo.authors[0] || 'Unknown Author';
        let description = bookData.items[0].volumeInfo.description || 'Description not available';
        let newBook = new model({
            title,
            author,
            description,
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
            const book = await Book.findOne({ isbn: isbn });
            return book;
        } catch (error) {
            console.error('Error finding book by ISBN:', error);
            throw error;
        }
    }
}

module.exports = bookFunctions;