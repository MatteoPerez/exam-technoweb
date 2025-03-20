import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './books.css';
import SearchBar from './components/searchBar';

export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]); // Liste des livres filtrés
  const [showAddBookForm, setShowAddBookForm] = useState(false); // État pour afficher/masquer le formulaire
  const [newBook, setNewBook] = useState({
    title: '',
    authorFirstName: '',
    authorLastName: '',
    yearPublished: '',
  });
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
    navigate(`/books/${id}`);
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
    setFilteredBooks(results);
  };

  // Fonction pour gérer l'ajout d'un nouveau livre
  const handleAddBook = () => {
    fetch('http://localhost:3001/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newBook.title,
        authorFirstName: newBook.authorFirstName,
        authorLastName: newBook.authorLastName,
        yearPublished: parseInt(newBook.yearPublished, 10),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add book');
        }
        return response.json();
      })
      .then((data) => {
        alert('Book added successfully!');
        setBooks((prevBooks) => [...prevBooks, data]); // Ajouter le nouveau livre à la liste
        setFilteredBooks((prevBooks) => [...prevBooks, data]); // Mettre à jour la liste filtrée
        setShowAddBookForm(false); // Fermer le formulaire
        setNewBook({ title: '', authorFirstName: '', authorLastName: '', yearPublished: '' }); // Réinitialiser le formulaire
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  return (
    <div className="book-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <SearchBar onSearch={handleSearch} />

      <h1 className="title">Books</h1>

      {/* Bouton pour afficher le formulaire d'ajout de livre */}
      <button
        onClick={() => setShowAddBookForm(true)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#61dafb',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add New Book
      </button>

      {/* Formulaire d'ajout de livre */}
      {showAddBookForm && (
        <div style={{ marginBottom: '20px', textAlign: 'left', display: 'inline-block' }}>
          <h3>Add a New Book</h3>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="Author First Name"
            value={newBook.authorFirstName}
            onChange={(e) => setNewBook({ ...newBook, authorFirstName: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="Author Last Name"
            value={newBook.authorLastName}
            onChange={(e) => setNewBook({ ...newBook, authorLastName: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <input
            type="number"
            placeholder="Year Published"
            value={newBook.yearPublished}
            onChange={(e) => setNewBook({ ...newBook, yearPublished: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <button
            onClick={handleAddBook}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          <button
            onClick={() => setShowAddBookForm(false)}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="books-container">
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
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
