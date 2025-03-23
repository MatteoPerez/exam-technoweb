import React, { useEffect, useState } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import BookCard from './components/bookCard'; // Assurez-vous que le chemin est correct
import { Book, Author } from './components/types';
import { Link as MuiLink , Breadcrumbs } from '@mui/material';
import Styles from './authorById.module.css'

const AuthorById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);  // Typage d'Author avec un état initial null
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/authors/${id}`)
        .then((response) => response.json())
        .then((data) => {console.log("Fetched author data:", data); setAuthor(data);
          // Calculer la moyenne des notes des livres
          if (data.books && data.books.length > 0) {
            const totalRating = data.books.reduce((acc: number, book: Book) => acc + book.rating, 0);
            console.log(data.books[0].rating);
            console.log(data.books[1].rating);
            const avgRating = totalRating / data.books.length;
            setAverageRating(avgRating); // Mettre à jour la moyenne des notes
          }
        })
        .catch((error) => console.error('Error fetching author details:', error));
    }
  }, [id]);

  const handleDeleteAuthor = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author? This will also delete all their books."
    );
    if (confirmDelete) {
      fetch(`http://localhost:3001/authors/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the author");
          }
          alert("Author deleted successfully!");
          navigate("/authors");
        })
        .catch((error) => console.error("Error deleting author:", error));
    }
  };

  if (!author) {
    return <div>Loading...</div>;
  }

  // Vérification de l'existence des propriétés avant de les utiliser
  const firstName = author.first_name ? author.first_name : 'Unknown';
  const lastName = author.last_name ? author.last_name : 'Unknown';
  const biography = author.biography ? author.biography : 'No biography available';

  return (
    <div className={Styles.pageStyle}>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 , justifyContent :'flex-start' , display : 'flex'}}>
        <Link to="/" color="inherit">Home</Link>
        <Link to="/authors" color="inherit">
        Authors
        </Link>
        <Link
          to={`/authors/${id}`} // Navigation vers le détail du livre
          color="inherit"
        >
          {author.first_name} {author.last_name}
        </Link>
      </Breadcrumbs>

      <div className={Styles.infoBook}>
        {author.photo ? (
          <img className={Styles.cover}
            src={author.photo}
            alt={`${firstName} ${lastName}`}
          />
        ) : (
          <div className={Styles.cover}>No photo available</div>
        )}
        <div className={Styles.authorInfo}>
          <h1 className={Styles.title}>{firstName} {lastName}</h1>
          <p>Biography: {biography}</p>
          <p>Books Written: {author.books ? author.books.length : 0}</p>
          {averageRating !== null && (
            <p>Average Rating: {averageRating.toFixed(2)}</p> // Afficher la moyenne avec 2 décimales
          )}
          <button className={Styles.button}
            onClick={handleDeleteAuthor}
          >Delete</button>
        </div>
      </div>
      
      <h2 className={Styles.bookTitle}>Books</h2>
      {author.books && author.books.length > 0 ? (
        <div className={Styles.booksContainer}>
          {author.books.map((book: Book) => (
            <BookCard
              id={book.id}               // Passe l'id de book
              title={book.title}         // Passe le titre de book
              year_published={book.year_published} // Passe l'année de publication
              rating={book.rating}       // Passe la note
              author={author} // Passe l'auteur de manière sécurisée
              onClick={() => navigate(`/books/${book.id}` , { state: { fromAuthor: true, authorName: author.first_name, bookTitle: book.title } })} // Passe la fonction onClick
            />
          ))}
        </div>
      ) : (
        <p>No books found for this author</p>
      )}
    </div>
  );
};

export default AuthorById;
