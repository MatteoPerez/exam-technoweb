import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Pour récupérer les paramètres d'URL
import './bookById.css';

const BookById = () => {
  const { id } = useParams();  // Récupérer l'ID de l'URL
  const [book, setBook] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/books/${id}`)  // Appeler l'API pour obtenir les détails du livre
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => console.error('Error fetching book details:', error));
    }
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className='title'>{book.title}</h1>
      <p>Author: {book.author.first_name} {book.author.last_name}</p>
      <p>Year Published: {book.year_published}</p>
      <p>Rating: {book.rating}</p>
      <p>{book.description}</p>
      {/* Ajoute des informations supplémentaires si nécessaire */}
    </div>
  );
}

export default BookById;