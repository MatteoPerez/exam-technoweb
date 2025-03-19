import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import Books from './pages/books';
import Authors from './pages/authors';
import BookById from './pages/bookById';
import AuthorById from './pages/authorById';

export default function App() {
  return (
      <Router>
          <nav>
          <Link to="/" style={{ margin: '10px' }}>Home</Link>
          <Link to="/books" style={{ margin: '10px' }}>Books</Link>
          <Link to="/authors" style={{ margin: '10px' }}>Authors</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books/:id" element={<BookById />} /> {/* Route dynamique */}
          <Route path="/authors/:id" element={<AuthorById />} /> {/* Route dynamique */}
        </Routes>
      </Router>
  );
}