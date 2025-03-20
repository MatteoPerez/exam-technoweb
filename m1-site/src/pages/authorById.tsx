import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AuthorById = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch author details with books
      fetch(`http://localhost:3001/authors/${id}`) // Appeler l'API pour obtenir l'auteur et ses livres
        .then((response) => response.json())
        .then((data) => setAuthor(data))
        .catch((error) => console.error('Error fetching author details:', error));
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
    </div>
  );
};

export default AuthorById;