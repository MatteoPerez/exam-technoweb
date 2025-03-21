import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import Books from './pages/books';
import Authors from './pages/authors';
import BookById from './pages/bookById';
import AuthorById from './pages/authorById';
import EditPage from './pages/edit';
import './App.css'

// Importer les icônes
import homeIcon from './icon/home_icon.svg'
import bookIcon from './icon/book_icon.svg';
import authorIcon from './icon/author_icon.svg';

export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsSidebarExpanded(true);  // Déclenche l'élargissement de la barre latérale
  };

  const handleMouseLeave = () => {
    setIsSidebarExpanded(false); // Réduit la barre latérale
  };

  return (
    <Router>
      {/* Barre latérale */}
      <div
        className={`sidebar ${isSidebarExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="nav-links">
          <Link to="/">
            <img src={homeIcon} alt="Home" />
            <span className="page-text">Home</span>
          </Link>
          <Link to="/books">
            <img src={bookIcon} alt="Books" />
            <span className="page-text">Books</span>
          </Link>
          <Link to="/authors">
            <img src={authorIcon} alt="Authors" />
            <span className="page-text">Authors</span>
          </Link>
        </div>
      </div>

      {/* Contenu principal décalé */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books/:id" element={<BookById />} />
          <Route path="/authors/:id" element={<AuthorById />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </div>
    </Router>
  );
}