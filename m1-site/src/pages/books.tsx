import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './books.css';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleBookClick = (id: string) => {
    navigate(`/books/${id}`); // Redirige vers /books/id
  };

  return (
    <div className='book-page' style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Books</h1>
      <p>Here you can explore all the books in our library.</p>

      <div className="books-container">
        {books.length === 0 ? (
          <p>Loading books...</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
                <div className="book-image"> {/* Image en arrière-plan */}
                  <div className ="book-cover">
                    <div className="book-info">
                      <h2>{book.title}</h2>
                    </div>
                  </div>
                </div>
                <div className='book-info-zone'>
                  <h3>{book.title}</h3>
                  <div className='book-details'>
                    <p>Author: {book.author.first_name} {book.author.last_name}</p>
                    <p>Year: {book.year_published}</p>
                    <p>Rating: {book.rating}</p>
                  </div>
                </div>
              </div>
          ))
        )}
      </div>
    </div>
  );
}