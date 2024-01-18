import React, { useState, useEffect } from 'react';
import AddBookForm from '../components/AddBookForm'

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Get the token from your authentication system (e.g., stored in localStorage)
        const token = localStorage.getItem('token');
        // console.log(token)
  
        if (!token) {
          console.error('No token available. User is not authenticated.');
          // Handle the case where the user is not authenticated
          return;
        }
  
        const response = await fetch('http://localhost:3001/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      }
    };
  
    fetchBooks();
  }, []);

  const handleAddBook = async (newBook) => {
    try {
      // Get the token from your authentication system (e.g., stored in localStorage)
      const token = localStorage.getItem('token');
    //   console.log(token)
  
      if (!token) {
        console.error('No token available. User is not authenticated.');
        // Handle the case where the user is not authenticated
        return;
      }
  
      // Make a request to the backend to add the book
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newBook),
      });
  
      const responseData = await response.json();
  
      // Check if the book was added successfully
      if (response.ok) {
        console.log('Book added successfully:', responseData);
        // Refresh the book list
        setBooks((prevBooks) => [...prevBooks, responseData]);
      } else {
        console.error('Failed to add book:', responseData.msg);
        // Handle the case where adding the book failed
      }
    } catch (error) {
      console.error('Failed to add book:', error.message);
      // Handle other errors (network issues, etc.)
    }
  };
  

  return (
    <div>
      <h1>Book List</h1>
      {/* {books.map((book) => (
        <div key={book.id}>
          <p>Title: {book.title}</p>
          <p>Author: {book.author}</p>
          <hr />
        </div>
      ))} */}
      <AddBookForm onAddBook={handleAddBook} />
    </div>
  );
};

export default BookList;
