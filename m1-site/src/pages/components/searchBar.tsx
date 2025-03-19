import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void; // Fonction à appeler lors de la recherche
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>(''); // État pour la valeur de la recherche

  // Gérer la saisie de l'utilisateur dans la barre de recherche
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Gérer l'événement de soumission de la recherche
  const handleSearch = () => {
    onSearch(query); // Appeler la fonction onSearch passée en prop
  };

  return (
    <div className="search-bar" style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="🔎 Search..."
        style={{
          padding: '10px',
          paddingLeft: '20px',
          fontSize: '16px',
          height: '30px',
          width: '700px',
          borderRadius: '50px',
          border: '2px solid #ccc',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100px',
          height: '50px',
          backgroundColor: '#61dafb',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          marginLeft: '20px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;