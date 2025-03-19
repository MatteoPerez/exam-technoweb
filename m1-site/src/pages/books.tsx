import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './books.css';
import SearchBar from './components/searchBar';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]); // Liste des livres filtrés
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data); // Initialiser la liste filtrée avec tous les livres
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleBookClick = (id: string) => {
    navigate(`/books/${id}`); // Redirige vers /books/id
  };

  // Fonction de recherche
  const handleSearch = (query: string) => {
    // Filtrer les livres en fonction de la recherche
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.first_name.toLowerCase().includes(query.toLowerCase()) ||
        book.author.last_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(results); // Mettre à jour la liste filtrée
  };

  return (
    <div className="book-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      
      <SearchBar onSearch={handleSearch} />

      <h1 className="title">Books</h1>
      

      <div className="books-container">
        {filteredBooks.length === 0 ? (
          <p>No books found.</p> // Message si aucun livre n'est trouvé
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
              <div className="book-image"> {/* Image en arrière-plan */} 
                <div className="book-cover">
                  <div className="book-info">
                    <h2>{book.title}</h2>
                  </div>
                </div>
              </div>
              <div className="book-info-zone">
                <h3>{book.title}</h3>
                <div className="book-details">
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
