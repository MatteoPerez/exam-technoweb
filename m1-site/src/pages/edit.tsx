import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

const EditPage = () => {
  const { id } = useParams();
  console.log('EditPage id:', id); // Debug statement to check the id
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author_fname, setAuthorFname] = useState('');
  const [author_lname, setAuthorLname] = useState('');
  const [yearPublished, setYearPublished] = useState('');

  useEffect(() => {
    // Fetch the book details using the id and set the state
    fetch(`http://localhost:3001/books/${id}`)
      .then((response) => response.json())
      .then((book) => {
        setTitle(book.title);
        setAuthorFname(book.author.first_name);
        setAuthorLname(book.author.last_name);
        setYearPublished(book.year_published);
      })
      .catch((error) => console.error('Error fetching book details:', error));
  }, [id]);

  const handleConfirm = () => {
    const updatedBook = {
      title,
      author: { first_name: author_fname, last_name: author_lname },
      year_published: yearPublished,
    };

    console.log('Request body:', JSON.stringify(updatedBook, null, 2));

    fetch(`http://localhost:3001/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    })
      .then((response) => {
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
          return response.text().then((text) => { // Log the response text
            console.error('Response text:', text);
            throw new Error('Failed to update book');
          });
        }
        return response.json();
      })
      .then(() => {
        alert('Book updated successfully!');
        navigate(`/books/${id}`);
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        alert('Failed to update book. Please try again.');
      });
  };

  return (
    <div>
      <TextField
        label="New Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Author First Name"
        value={author_fname}
        onChange={(e) => setAuthorFname(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Author Last Name"
        value={author_lname}
        onChange={(e) => setAuthorLname(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Year Published"
        value={yearPublished}
        onChange={(e) => setYearPublished(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginRight: 10 }}>
        Confirm
      </Button>
      <Button variant="contained" color="secondary">
        <Link to={`/books/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Return</Link>
      </Button>
    </div>
  );
};

export default EditPage;