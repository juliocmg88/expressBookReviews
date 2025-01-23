const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL
  const review = req.query.review; // Get the review from the query parameters
  const username = req.session.authorization?.username; // Get the username from the session

  // Check if ISBN and review are provided
  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  // Check if the book exists
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If the book exists, add or update the review
  if (!book.reviews) {
    book.reviews = {}; // Initialize the reviews object if it doesn't exist
  }

  book.reviews[username] = review; // Add or update the review for the username
  return res.status(200).json({ message: "Review successfully added/updated", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL
  const username = req.session.authorization?.username; // Get the username from the session

  // Check if ISBN is provided
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  // Check if the book exists
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the book has reviews
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this book by the user" });
  }

  // Delete the user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review successfully deleted", reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
