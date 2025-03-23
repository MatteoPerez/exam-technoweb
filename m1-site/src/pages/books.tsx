import React, { useEffect, useState } from 'react';
import { Breadcrumbs , Link , Button, TextField , MenuItem, Checkbox, FormControlLabel} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './books.module.css'
import SearchBar from './components/searchBar';
import BookCard from "./components/bookCard" // Assure-toi du bon chemin d'importation
import CreationPage from "./creationPage"


export default function Books() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]); // Liste des livres filtrés
  const [showAddBookForm, setShowAddBookForm] = useState(false); // État pour afficher/masquer le formulaire
  const years = Array.from(new Array(100), (val, index) => 2025 - index);
  const [checked, setChecked] = useState(false);
  const [useExistingAuthor, setUseExistingAuthor] = useState(true);
  const [authors, setAuthors] = useState<any[]>([]);
  const [newBook, setNewBook] = useState({
    title: '',
    authorFirstName: '',
    authorLastName: '',
    yearPublished: '',
    authorId: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
      fetch('http://localhost:3001/authors') // Remplacez par l'API de vos auteurs
        .then((response) => response.json())
        .then((data) => {
          setAuthors(data);
        })
        .catch((error) => console.error('Error fetching authors:', error));
    }, []);

  useEffect(() => {
    fetch('http://localhost:3001/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data); // Initialiser la liste filtrée avec tous les livres
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  const handleBookClick = (id: string) => {
    navigate(`/books/${id}`);
  };

  // Fonction de recherche
  const handleSearch = (query: string) => {
    // Filtrer les livres en fonction de la recherche
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.first_name.toLowerCase().includes(query.toLowerCase()) ||
        book.author.last_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(results);
  };

  // Fonction pour gérer l'ajout d'un nouveau livre
  const handleAddBook = () => {

    const requestBody = newBook.authorId !== '' 
    ? {
        title: newBook.title,
        authorId: newBook.authorId, // Utiliser l'ID de l'auteur
        yearPublished: parseInt(newBook.yearPublished, 10),
      }
    : {
        title: newBook.title,
        authorFirstName: newBook.authorFirstName, // Utiliser le prénom de l'auteur
        authorLastName: newBook.authorLastName,   // Utiliser le nom de l'auteur
        yearPublished: parseInt(newBook.yearPublished, 10),
      };
    
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

    fetch('http://localhost:3001/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add book');
        }
        return response.json();
      })
      .then((data) => {
        alert('Book added successfully!');
        setBooks((prevBooks) => [...prevBooks, data]); // Ajouter le nouveau livre à la liste
        setAuthors((prevAuthors) => [...prevAuthors, data])
        setFilteredBooks((prevBooks) => [...prevBooks, data]); // Mettre à jour la liste filtrée
        setShowAddBookForm(false); // Fermer le formulaire
        setNewBook({ title: '', authorFirstName: '', authorLastName: '', yearPublished: '', authorId: '' }); // Réinitialiser le formulaire
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  return (
    <div className={styles.bookPage}>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
              <Link href="/" color="inherit">
                Home
              </Link>
              <Link href="/books" color="inherit">
                Books
              </Link>
      </Breadcrumbs>

      <div className={styles.searchBar}>
        <SearchBar onSearch={handleSearch} />
      </div>

      <h1 className={styles.title}>Books</h1>
      

      <div className={styles.creationZone}>
            <button className={styles.addButton}
              onClick={() => setShowAddBookForm(true)}
            >
              Add New Book
            </button>
            {showAddBookForm && (
              <div className={styles.createBookZone}>
                <h3>Add a New Book</h3>
                <div className={styles.editZone}>
                <div className={styles.bookFields}>
                        <h3>Book</h3>
                        <TextField
                          label="Title"
                          variant="outlined"
                          sx={{
                              "& .MuiOutlinedInput-root": {
                              borderRadius: "30px",
                              paddingLeft: "30px",
                              },
                          }}
                          type="text"
                          value={newBook.title}
                          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        />
                        <TextField select 
                          label="Year Published"
                          variant="outlined"
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px", paddingLeft: "30px", width:'250px'},}}
                          onChange={(e) => setNewBook({ ...newBook, yearPublished: e.target.value })}>
                          {years.map((year) => (
                          <MenuItem key={year} value={year}>
                          {year}
                          </MenuItem>
                          ))}
                        </TextField>
                      </div>
                      

                      <div className={styles.separator}></div>


                      <div className={styles.authorFields}>
                          <h3>Author</h3>
                          <FormControlLabel
                            control={
                              <Checkbox checked={!useExistingAuthor} onChange={() => setUseExistingAuthor(!useExistingAuthor)} />
                            }
                            label="Author not existing yet"
                            sx={{marginTop:'-20px'}}
                          />
                          

                          {useExistingAuthor ? (
                            <TextField
                            value={newBook.authorId}
                            select
                            label="Select Author"
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px", paddingLeft: "30px", width:'250px'}
                            }}
                            onChange={(e) => setNewBook({ ...newBook, authorId: e.target.value })}
                          >
                            {authors.map((author) => (
                              <MenuItem key={author.id} value={author.id}>
                                {author.first_name} {author.last_name}
                              </MenuItem>
                            ))}
                          </TextField>
                          ) : (
                          <>
                            <TextField
                              label="First Name"
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "30px",
                                  paddingLeft: "10px",
                                },
                              }}
                              type="text"
                              value={newBook.authorFirstName}
                              onChange={(e) => setNewBook({ ...newBook, authorFirstName: e.target.value })}
                            />
                            <TextField
                              label="Last Name"
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "30px",
                                  paddingLeft: "10px",
                                },
                              }}
                              type="text"
                              value={newBook.authorLastName}
                              onChange={(e) => setNewBook({ ...newBook, authorLastName: e.target.value })}
                            />
                          </>
                        )}
                      </div>

                      
                  </div>
                  <div className={styles.buttonZone}>
                  <button onClick={handleAddBook}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              width : '100px'
                            }}>Submit</button>

                          <button onClick={() => setShowAddBookForm(false)}
                            style={{
                              marginLeft: '10px',
                              padding: '10px 20px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              width : '100px'
                            }}>Cancel</button>
                  </div>
              </div>
            )}
      </div>

      <div className={styles.booksContainer}>
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className={styles.bookCard} onClick={() => handleBookClick(book.id)}>
              <div className={styles.bookImage}> {/* Image en arrière-plan */} 
                <div className={styles.bookCover}>
                  <div className={styles.bookInfo}>
                    <h2>{book.title}</h2>
                  </div>
                </div>
              </div>
              <div className={styles.bookInfoZone}>
                <h3>{book.title}</h3>
                <div className={styles.bookDetails}>
                  <p>Author: {book.author.first_name} {book.author.last_name}</p>
                  <p>Year: {book.year_published}</p>
                  <p>Rating: {book.rating}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
