const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Sample book data
const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: 'ISBN 1234567890', review: '' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: 'ISBN 2345678901', review: '' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: 'ISBN 3456789012', review: '' },
  { id: 4, title: '1984', author: 'George Orwell', isbn: 'ISBN 4567890123', review: '' },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: 'ISBN 5678901234', review: '' },
  { id: 6, title: 'To the Lighthouse', author: 'Virginia Woolf', isbn: 'ISBN 6789012345', review: '' },
  { id: 7, title: 'Moby-Dick', author: 'Herman Melville', isbn: 'ISBN 7890123456', review: '' },
  { id: 8, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: 'ISBN_8901234567', review: '' },
  { id: 9, title: 'Brave New World', author: 'Aldous Huxley', isbn: 'ISBN 9012345678', review: '' },
  { id: 10, title: 'The Odyssey', author: 'Homer', isbn: 'ISBN 0123456789', review: '' }
];


// Task 1: Get the book list available in the shop.
app.get('/books', (req, res) => {
  res.json(books);
});


// Task 2: Get the books based on ISBN.
app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});


// Task 3: Get all books by Author.
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.filter((b) => b.author === author);
  res.json(booksByAuthor);
});


// Task 4: Get all books based on Title.
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const booksWithTitle = books.filter((b) => b.title === title);
  res.json(booksWithTitle);
});


// Task 5: Get book Review.
app.get('/books/:id/reviews', (req, res) => {
  const bookId = parseInt(req.params.id);

  // Find the book by ID
  const book = books.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Get the review of the book
  const review = book.review;

  // Send the review as the response
  res.status(200).json({ review });
});

// User array to store registered users
const users = [];


// Task 6:Register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Create a new user object and add it to the users array
  const newUser = { username, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});


// Task 7: Login as a registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the users array
  const user = users.find(user => user.username === username);

  // Check if the user exists and the password matches
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful' });
});


// Task 8: Add/Modify a book review.
app.post('/books/:id/reviews', (req, res) => {
  const bookId = parseInt(req.params.id);
  const review = req.body.review;

  // Find the book by ID
  const book = books.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Update the review field of the book
  book.review = review;

  // Send a success response
  res.status(200).json({ message: 'Review added successfully' });
});


// Task 9: Delete book review added by that particular user.
app.delete('/books/:id/reviews', (req, res) => {
  const bookId = parseInt(req.params.id);

  // Find the book by ID
  const book = books.find((book) => book.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Delete the review of the book
  book.review = '';

  // Send a success response
  res.status(200).json({ message: 'Review deleted successfully' });
});


// Task 10: Get all books.
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:3000/books');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books');
  }
}

// Task 11: Search by ISBN.
function searchByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:3000/books/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => {
        console.error(error);
        reject(new Error('Failed to fetch book by ISBN'));
      });
  });
}


// Task 12: Search by Author.
async function searchByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:3000/books/author/${author}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books by author');
  }
}

// Task 13: Search by Title.
async function searchByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/books/title/${title}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch books by title');
  }
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
