import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AuthorById = () => {
  const { id } = useParams();  // Récupérer l'ID de l'URL
  const [author, setAuthor] = useState<any | null>(null);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      // Fetch author details
      fetch(`http://localhost:3001/authors/${id}`)  // Appeler l'API pour obtenir les détails de l'auteur
        .then((response) => response.json())
        .then((data) => setAuthor(data))
        .catch((error) => console.error('Error fetching author details:', error));

      // Fetch books by the author
      fetch(`http://localhost:3001/books?authorId=${id}`)  // Appeler l'API pour obtenir les livres de l'auteur
        .then((response) => response.json())
        .then((data) => setBooks(data))
        .catch((error) => console.error('Error fetching books:', error));
    }
  }, [id]);

  if (!author) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{author.first_name} {author.last_name}</h1>
      <p>Biography: {author.biography}</p>
      {/* Liste des livres de l'auteur */}
      <h2>Books:</h2>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <Link to={`/books/${book.id}`}>{book.title}</Link> {/* Lien vers la page du livre */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found for this author.</p>
      )}
    </div>
  );
}

export default AuthorById;