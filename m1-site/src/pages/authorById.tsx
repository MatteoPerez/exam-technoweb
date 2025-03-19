import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Pour récupérer les paramètres d'URL

const AuthorById = () => {
  const { id } = useParams();  // Récupérer l'ID de l'URL
  const [author, setAuthor] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/authors/${id}`)  // Appeler l'API pour obtenir les détails de l'auteur
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
      {/* Ajoute d'autres informations sur l'auteur si nécessaire */}
    </div>
  );
}

export default AuthorById;