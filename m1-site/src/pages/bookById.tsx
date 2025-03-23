import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link , useLocation } from 'react-router-dom';
import {Link as MuiLink} from '@mui/material';
import { Drawer, Button, List, ListItem, ListItemText, TextField, Rating , Breadcrumbs , Typography} from '@mui/material';
import Styles from './bookById.module.css'

const BookById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<any[]>([]);
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const location = useLocation();
  const state = location.state as { fromAuthor?: boolean; authorName?: string };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/books/${id}/ratings`)
        .then((response) => response.json())
        .then((data) => setRatings(data))
        .catch((error) => console.error('Error fetching ratings:', error));
    }
  }, [id]);

  const sortRatings = (ascending: boolean) => {
    const sortedRatings = [...ratings].sort((a, b) => (ascending ? a.date - b.date : b.date - a.date));
    setRatings(sortedRatings);
  };

  const handleAddRating = () => {
    if (!newRating) {
      alert("Please select a rating!");
      return;
    }
  
    const newRatingObj = {
      author_fname : firstName,
      author_lname : lastName,
      stars: newRating,
      comment: newComment,
      id_book: id,
      date: new Date().toISOString(),
    };

    console.log("Sending JSON:", JSON.stringify(newRatingObj, null, 2));
  
    fetch(`http://localhost:3001/books/${id}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRatingObj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit rating");
        }
        return response.json();
      })
      .then((data) => {
        alert("Rating submitted successfully!");
        setDrawerOpen(false);
        setNewRating(null);
        setNewComment("");
        
        fetchRatings();
      })
      .catch((error) => console.error("Error submitting rating:", error));
  };

  const handleDeleteBook = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
      fetch(`http://localhost:3001/books/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the book");
          }
          alert("Book deleted successfully!");
          navigate("/books");
        })
        .catch((error) => console.error("Error deleting book:", error));
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book:', error);
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  const fetchRatings = () => {
    fetch(`http://localhost:3001/books/${id}/ratings`)
      .then((response) => response.json())
      .then((data) => {setRatings(data); updateBookRating(data);})
      .catch((error) => console.error("Error fetching ratings:", error));
  };

  const updateBookRating = (ratings: any[]) => {
    if (ratings.length === 0) {
      return; // Si aucune évaluation, ne pas mettre à jour la note
    }

    const totalStars = ratings.reduce((acc, rating) => acc + rating.stars, 0);
    const averageRating = totalStars / ratings.length;

    // Mettre à jour la note moyenne du livre
    setBook((prevBook: any) => ({
      ...prevBook,
      rating: averageRating.toFixed(1), // Afficher avec une décimale
    }));
  };

  return (
    <div className={Styles.pageStyle}>

      <Breadcrumbs className={Styles.breadscrumb} aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
        {state?.fromAuthor ? (
          <>
            <div className={Styles.breadcrumb} style={{ display: 'flex', alignItems: 'center' , color:'rgb(119, 119, 119)'}}>
              <MuiLink href="/" color="inherit">Home</MuiLink>
              <Typography sx={{ margin: '0 8px' , color:'rgb(119, 119, 119)' }}> / </Typography> {/* Séparateur avec marges */}
              <MuiLink href="/authors" color='rgb(119, 119, 119)'>Authors</MuiLink>
              <Typography sx={{ margin: '0 8px' , color:'rgb(119, 119, 119)' }}> / </Typography> {/* Séparateur avec marges */}
              <MuiLink component={Link} color='rgb(119, 119, 119)' to={`/authors/${book.author.id}`}>
                {state.authorName} {book.author.last_name}
              </MuiLink>
              <Typography color="inherit" sx={{ margin: '0 8px' , color:'rgb(119, 119, 119)' }}> / </Typography>
              <MuiLink component={Link} to={`/books/${id}`} color='rgb(119, 119, 119)'>{book.title}</MuiLink>
            </div>
          </>
        ) : (
          <>
            <div className={Styles.breadcrumb} style={{ display: 'flex', alignItems: 'center' }}>
              <MuiLink href="/" color="inherit">Home</MuiLink>
              <Typography sx={{ margin: '0 8px' , color:'rgb(119, 119, 119)' }}> / </Typography>
              <MuiLink component={Link} to="/books" color="inherit">Books</MuiLink>
              <Typography color="inherit" sx={{ margin: '0 8px' }}> / </Typography>
              <MuiLink component={Link} to={`/books/${id}`} color="inherit">{book.title}</MuiLink>
            </div>
          </>
        )}
      </Breadcrumbs>

          <div className={Styles.infoBook}>
            <div className={Styles.cover}>No cover available</div>
            <div className={Styles.detailBook}>
                <h1 className={Styles.title}>{book.title}</h1>
                {/* Link to the author's page */}
                <p>
                  Author:{' '}
                  <MuiLink href={`/authors/${book.author.id}`} style={{ textDecoration: 'none', color: '#61dafb' }}>
                    {book.author.first_name} {book.author.last_name}
                  </MuiLink>
                </p>
                <p>Year Published: {book.year_published}</p>
                <p>
                Rating:{" "}
                {ratings.length > 0
                    ? (ratings.reduce((sum: number, rating: any) => sum + rating.stars, 0) / ratings.length).toFixed(1)
                    : "No ratings yet"}
                </p>
                <p>{book.description}</p>
                <div className={Styles.button}>
                <Button sx={{ marginTop: "20px" , backgroundColor: "#61dafb", color: "black", "&:hover": { backgroundColor: "darkblue" } }} onClick={() => setDrawerOpen(true)} variant="contained"> Ratings </Button>
                <Button
                  sx={{
                    marginTop: "20px",
                    backgroundColor: "#bb73cf",
                    color: "white",
                    "&:hover": { backgroundColor: "#9244a7" },
                  }}
                  className='button'
                  onClick={() => navigate(`/edit/${id}`)} // Navigate to the edit page
                >
                  Edit
                </Button>
                <Button
                  sx={{
                    marginTop: "20px",
                    backgroundColor: "#f44336",
                    color: "white",
                    "&:hover": { backgroundColor: "darkred" },
                  }}
                  onClick={handleDeleteBook}
                  variant="contained"
                >
                  Delete
                </Button>
                </div>
        </div>

      <Drawer
        className='drawer'
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div style={{ width: '300px', padding: '20px' }}>
          <h3>Add Comment</h3>

          {/* Tri des évaluations */}
          <Button
            onClick={() => sortRatings(true)}
            variant="outlined"
            color="primary"
            style={{ marginBottom: '10px', marginRight: '10px' }}
          >
            Trier par date (Ascendant)
          </Button>
          <Button
            onClick={() => sortRatings(false)}
            variant="outlined"
            color="primary"
            style={{ marginBottom: '10px' }}
          >
            Trier par date (Descendant)
          </Button>

          <TextField
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ marginBottom: 2 }}
            />
          {/* Formulaire pour ajouter une nouvelle évaluation */}
          <TextField
            label="Commentaire"
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            style={{ marginBottom: '10px' }}
          />
          <Rating
            value={newRating}
            onChange={(event, newValue) => setNewRating(newValue)}
            size="large"
            style={{ marginBottom: '10px' }}
          />
          <Button
            onClick={handleAddRating}
            variant="contained"
            color="secondary"
            style={{ marginBottom: '20px' }}
          >
            Add Comment
          </Button>
          
          <h3>Comments</h3>
          <List>
            {ratings.map((rating) => (
              <ListItem key={rating.id}>
                <ListItemText
                  primary={`Note: ${rating.stars} étoiles`}
                  secondary={
                    <>
                      <p>{rating.author_fname} {rating.author_lname}</p>
                      <p>{rating.comment}</p>
                      <p>{rating.date.toLocaleString()}</p>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
    </div>
  );
};

export default BookById;
