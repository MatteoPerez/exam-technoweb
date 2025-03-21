import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authors.css';
import SearchBar from './components/searchBar';

export default function Authors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<any[]>([]);
  const [showAddAuthorForm, setShowAddAuthorForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    firstName: '',
    lastName: '',
    biography: '',
    photo: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/authors')
      .then((response) => response.json())
      .then((data) => {
        setAuthors(data);
        setFilteredAuthors(data);
      })
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  const handleAuthorSearch = (query: string) => {
    const results = authors.filter(
      (author) =>
        author.first_name.toLowerCase().includes(query.toLowerCase()) ||
        author.last_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAuthors(results);
  };

  const handleAddAuthor = () => {
    if (!newAuthor.firstName.trim() || !newAuthor.lastName.trim()) {
      alert('First Name and Last Name are required!');
      return;
    }

    const payload = {
      first_name: newAuthor.firstName,
      last_name: newAuthor.lastName,
      biography: newAuthor.biography || null,
      photo: newAuthor.photo || null,
    };

    console.log('Payload being sent:', payload);

    fetch('http://localhost:3001/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add author');
        }
        return response.json();
      })
      .then((data) => {
        alert('Author added successfully!');
        setAuthors((prevAuthors) => [...prevAuthors, data]);
        setFilteredAuthors((prevAuthors) => [...prevAuthors, data]);
        setShowAddAuthorForm(false);
        setNewAuthor({ firstName: '', lastName: '', biography: '', photo: '' });
      })
      .catch((error) => console.error('Error adding author:', error));
  };

  const handleAuthorClick = (id: string) => {
    navigate(`/authors/${id}`);
  };

  return (
    <div className="author-page" style={{ textAlign: 'center', marginTop: '50px' }}>
      <SearchBar onSearch={handleAuthorSearch} />

      <h1 className="title">Authors</h1>

      {/* Button to show the add author form */}
      <button
        onClick={() => setShowAddAuthorForm(true)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#61dafb',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add New Author
      </button>

      {/* Add Author Form */}
      {showAddAuthorForm && (
        <div style={{ marginBottom: '20px', textAlign: 'left', display: 'inline-block' }}>
          <h3>Add a New Author</h3>
          <input
            type="text"
            placeholder="First Name *"
            value={newAuthor.firstName}
            onChange={(e) => setNewAuthor({ ...newAuthor, firstName: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="Last Name *"
            value={newAuthor.lastName}
            onChange={(e) => setNewAuthor({ ...newAuthor, lastName: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <textarea
            placeholder="Biography (optional)"
            value={newAuthor.biography}
            onChange={(e) => setNewAuthor({ ...newAuthor, biography: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px', height: '100px' }}
          />
          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={newAuthor.photo}
            onChange={(e) => setNewAuthor({ ...newAuthor, photo: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', padding: '5px', width: '300px' }}
          />
          <button
            onClick={handleAddAuthor}
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
            onClick={() => setShowAddAuthorForm(false)}
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

      <div className="authors-container">
        {filteredAuthors.length === 0 ? (
          <p>No authors found.</p>
        ) : (
          filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="author-card"
              onClick={() => handleAuthorClick(author.id)}
            >
              <div className="author-image">
                <div className="author-cover">
                  <div className="author-picture">
                    {author.photo ? (
                      <img
                        className="author-photo"
                        src={author.photo}
                        alt={`${author.first_name} ${author.last_name}`}
                      />
                    ) : (
                      <p>No photo available</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="author-info-zone">
                <h3>
                  {author.first_name} {author.last_name}
                </h3>
                <div className="author-details">
                  <p>Biography: {author.biography}</p>
                  <p>Books Written: {author.books ? author.books.length : 0}</p> {/* Display the number of books */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
