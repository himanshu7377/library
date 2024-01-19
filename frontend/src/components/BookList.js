import React, { useState, useEffect } from 'react';
import AddBookForm from '../components/AddBookForm';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showLast10Minutes, setShowLast10Minutes] = useState(false);

  const fetchBooks = async () => {
    try {
      // const role = localStorage.getItem('role');
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token available. User is not authenticated.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      };

      const response = await fetch('http://localhost:3001/books', {
        headers,
      });

      const data = await response.json();
      setBooks(data);
      applyFilters(data);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const applyFilters = (data) => {
    let filteredData = data;

    if (showLast10Minutes) {
      const currentTime = new Date();
      const tenMinutesAgo = new Date(currentTime - 10 * 60 * 1000);

      filteredData = data.filter((book) => new Date(book.createdAt) >= tenMinutesAgo);
    }

    setFilteredBooks(filteredData);
  };

  const handleAddBook = async (newBook) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token available. User is not authenticated.');
        return;
      }

      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newBook),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Book added successfully:', responseData);
        fetchBooks();
      } else {
        console.error('Failed to add book:', responseData.msg);
      }
    } catch (error) {
      console.error('Failed to add book:', error.message);
    }
  };

  const handleDeleteBook = async (bookId) => {

    try {
      console.log(bookId)
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token available. User is not authenticated.');
        return;
      }

      const response = await fetch(`http://localhost:3001/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Book deleted successfully:', responseData);
        fetchBooks();
      } else {
        console.error('Failed to delete book:', responseData.msg);
      }
    } catch (error) {
      console.error('Failed to delete book:', error.message);
    }
  };

  const handleCheckboxChange = () => {
    setShowLast10Minutes(!showLast10Minutes);
    applyFilters(books);
  };

  return (
    <div className="container  mx-auto mt-8">
      <h1 className="text-3xl text-center font-bold mb-4">Book List</h1>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-indigo-600"
            checked={showLast10Minutes}
            onChange={handleCheckboxChange}
          />
          <span className="ml-2 text-gray-700">Show books created within the last 10 minutes</span>
        </label>
      </div>
      <table className="w-full bg-white border border-gray-300">
        <thead>
          <tr className=' text-left'>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Author</th>
            <th className="py-2 px-4 border-b">Created At</th>
            {localStorage.getItem('role') === 'CREATOR' && <th className="py-2 px-4 border-b">Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{book.title}</td>
              <td className="py-2 px-4 border-b">{book.author}</td>
              <td className="py-2 px-4 border-b">{new Date(book.createdAt).toLocaleString()}</td>
              {localStorage.getItem('role') === 'CREATOR' && (
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {localStorage.getItem('role') === 'CREATOR' && <AddBookForm onAddBook={handleAddBook} />}
    </div>
  );
};

export default BookList;
