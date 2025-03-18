import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import Books from './pages/books';
import Authors from './pages/authors';

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
      </Routes>
    </Router>
  );
}