import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authors.css';

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/authors') // Remplacez par l'API de vos auteurs
      .then((response) => response.json())
      .then((data) => setAuthors(data))
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  const handleAuthorClick = (id: string) => {
    navigate(`/authors/${id}`); // Redirige vers /authors/id
  };

  return (
    <div className="author-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Authors</h1>
      <p>Explore the authors in our library.</p>

      <div className="authors-container">
        {authors.length === 0 ? (
          <p>Loading authors...</p>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="author-card"
              onClick={() => handleAuthorClick(author.id)}
            >
              <div className="author-image"> {/* Image en arrière-plan */}
                <div className="author-cover">
                  <div className="author-picture">
                      {author.photo ? (
                        <img className="author-photo" src={author.photo} alt={`${author.first_name} ${author.last_name}`} />
                      ) : (
                        <p></p>
                      )}
                    </div>
                </div>
              </div>
              <div className="author-info-zone">
                <h3>{author.first_name} {author.last_name}</h3>
                <div className="author-details">
                  <p>Biography: {author.biography}</p>
                  {/* Ajoutez d'autres détails de l'auteur si nécessaire */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}