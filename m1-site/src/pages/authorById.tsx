import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookCard from './components/bookCard'; // Assurez-vous que le chemin est correct
import { Book, Author } from './components/types';

const AuthorById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);  // Typage d'Author avec un état initial null

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/authors/${id}`)
        .then((response) => response.json())
        .then((data) => setAuthor(data))
        .catch((error) => console.error('Error fetching author details:', error));
    }
  }, [id]);

  const handleDeleteAuthor = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author? This will also delete all their books."
    );
    if (confirmDelete) {
      fetch(`http://localhost:3001/authors/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the author");
          }
          alert("Author deleted successfully!");
          navigate("/authors");
        })
        .catch((error) => console.error("Error deleting author:", error));
    }
  };

  if (!author) {
    return <div>Loading...</div>;
  }

  // Vérification de l'existence des propriétés avant de les utiliser
  const firstName = author.first_name ? author.first_name : 'Unknown';
  const lastName = author.last_name ? author.last_name : 'Unknown';
  const biography = author.biography ? author.biography : 'No biography available';

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{firstName} {lastName}</h1>
      {author.photo && (
        <img
          src={author.photo}
          alt={`${firstName} ${lastName}`}
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <p>Biography: {biography}</p>
      <p>Books Written: {author.books ? author.books.length : 0}</p>
      
      <h2>Books:</h2>
      {author.books && author.books.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {author.books.map((book: Book) => (
            <BookCard
              key={book.id}              // Utilisation de book.id comme key
              id={book.id}               // Passe l'id de book
              title={book.title}         // Passe le titre de book
              year_published={book.year_published} // Passe l'année de publication
              rating={book.rating}       // Passe la note
              author={book.author ? book.author : { first_name: 'Unknown', last_name: 'Unknown' }} // Passe l'auteur de manière sécurisée
              onClick={() => navigate(`/books/${book.id}`)} // Passe la fonction onClick
            />
          ))}
        </div>
      ) : (
        <p>No books found for this author.</p>
      )}
      
      <button
        onClick={handleDeleteAuthor}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Delete Author
      </button>
    </div>
  );
};

export default AuthorById;
