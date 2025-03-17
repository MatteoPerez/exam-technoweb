'use client';
import './App.css';

import React from 'react';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const Contact = () => <h1>Contact Page</h1>;

function App() {
  //return <h1>Hello World!!</h1>
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav>
          <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
          <Link to="/about" style={{ margin: '0 10px' }}>About</Link>
          <Link to="/contact" style={{ margin: '0 10px' }}>Contact</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;