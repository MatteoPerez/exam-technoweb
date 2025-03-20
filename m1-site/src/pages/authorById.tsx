import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AuthorById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/authors/${id}`) // Appeler l'API pour obtenir l'auteur et ses livres
        .then((response) => response.json())
        .then((data) => setAuthor(data))
        .catch((error) => console.error('Error fetching author details:', error));
    }
  }, [id]);

  const handleDeleteAuthor = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this author? This will also delete all their books.");
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

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{author.first_name} {author.last_name}</h1>
      <p>Biography: {author.biography}</p>
      {/* Liste des livres de l'auteur */}
      <h2>Books:</h2>
      {author.books && author.books.length > 0 ? (
        <ul>
          {author.books.map((book: any) => (
            <li key={book.id}>
              <Link to={`/books/${book.id}`}>{book.title}</Link> {/* Lien vers la page du livre */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found for this author.</p>
      )}
      {/* Bouton de suppression */}
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