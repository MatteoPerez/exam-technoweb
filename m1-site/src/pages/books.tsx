import React, { useEffect, useState } from 'react';
import './books.css';

// Composant pour afficher la liste des livres
export default function Books() {
    const [books, setBooks] = useState<any[]>([]);
  
    useEffect(() => {
      fetch('http://localhost:3001/books') // Assure-toi que ton API renvoie des livres
        .then((response) => response.json())
        .then((data) => setBooks(data))
        .catch((error) => console.error('Error fetching books:', error));
    }, []);
  
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Books</h1>
        <p>Here you can explore all the books in our library.</p>
  
        <div className="books-container">
          {books.length === 0 ? (
            <p>Loading books...</p> // Message si les livres ne sont pas encore chargés
          ) : (
            books.map((book) => (
              <div key={book.id} className="book-card"> {/* Utilisation de la classe CSS */}
                <h2>{book.title}</h2>
                <p>Author: {book.author.first_name} {book.author.last_name}</p>
                <p>Year: {book.year_published}</p>
                <p>Rating: {book.rating}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }