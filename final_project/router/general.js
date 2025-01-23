const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let regd_users = require("./auth_users.js").regd_users;
const public_users = express.Router();
const axios = require('axios'); // Import Axios

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get the book list using Promise callbacks
public_users.get('/books-promise', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books); // Simulate an async operation
  })
    .then((data) => {
      res.status(200).json(data); // Send the books as a response
    })
    .catch((error) => {
      res.status(500).json({ message: "Error retrieving books", error });
    });
});

// Get the book list using async-await with Axios
public_users.get('/books-async', async function (req, res) {
  try {
    // Simulate an external API call using Axios
    const response = await axios.get('https://api.example.com/books'); // Replace with a real API URL
    res.status(200).json(response.data); // Send the books as a response
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = Object.values(books).find(b => b.isbn === isbn);
    if (book) resolve(book);
    else reject("Book not found");
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error }));
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`https://api.example.com/books/isbn/${isbn}`); // Replace with a real API URL
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const book = Object.values(books).find(b => b.author === author);

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on Author using Promise callbacks
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const book = Object.values(books).filter(b => b.author === author);
    if (book.length > 0) resolve(book);
    else reject("Book not found");
  })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ message: error }));
});

// Get book details based on Author using async-await with Axios
public_users.get('/author-async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`https://api.example.com/books/author/${author}`); // Replace with a real API URL
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).find(b => b.title === title);

  if (book) {
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on Title using Promise callbacks
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const book = Object.values(books).filter(b => b.title === title);
    if (book.length > 0) resolve(book);
    else reject("Book not found");
  })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ message: error }));
});

// Get book details based on Title using async-await with Axios
public_users.get('/title-async/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`https://api.example.com/books/title/${title}`); // Replace with a real API URL
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
