import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authors.css';
import SearchBar from './components/searchBar';

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<any[]>([]); // État pour les auteurs filtrés
  const navigate = useNavigate();

  // Fonction de recherche pour filtrer les auteurs
  const handleAuthorSearch = (query: string) => {
    // Filtrer les auteurs en fonction de la recherche
    const results = authors.filter(
      (author) =>
        author.first_name.toLowerCase().includes(query.toLowerCase()) ||
        author.last_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAuthors(results); // Mettre à jour la liste filtrée des auteurs
  };

  useEffect(() => {
    fetch('http://localhost:3001/authors') // Remplacez par l'API de vos auteurs
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
        setFilteredAuthors(data); // Initialiser la liste filtrée avec tous les auteurs
      })
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  const handleAuthorClick = (id: string) => {
    navigate(`/authors/${id}`); // Redirige vers /authors/id
  };

  return (
    <div className="author-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Barre de recherche */}
      <SearchBar onSearch={handleAuthorSearch} />

      <h1 className='title'>Authors</h1>

      <div className="authors-container">
        {filteredAuthors.length === 0 ? (
          <p>No authors found.</p> // Message si aucun auteur n'est trouvé
        ) : (
          filteredAuthors.map((author) => (
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
                      <p></p> // Si l'auteur n'a pas de photo
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
