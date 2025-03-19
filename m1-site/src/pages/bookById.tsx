import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Drawer, Button, List, ListItem, ListItemText, TextField, Rating } from '@mui/material';
import './bookById.css';

const BookById = () => {
  const { id } = useParams(); // Récupérer l'ID du livre depuis l'URL
  const [ratings, setRatings] = useState<any[]>([]); // État pour stocker les évaluations
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Récupérer les évaluations du livre depuis l'API
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/books/${id}/ratings`)
        .then((response) => response.json())
        .then((data) => setRatings(data))
        .catch((error) => console.error('Error fetching ratings:', error));
    }
  }, [id]);

  // Fonction pour trier les évaluations par date
  const sortRatings = (ascending: boolean) => {
    const sortedRatings = [...ratings].sort((a, b) => (ascending ? a.date - b.date : b.date - a.date));
    setRatings(sortedRatings);
  };

  // Ajouter une nouvelle évaluation
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
      date: new Date().toISOString(), // Format standard pour la date
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
        
        // Mettre à jour la liste des ratings en récupérant les nouvelles données
        fetchRatings();
      })
      .catch((error) => console.error("Error submitting rating:", error));
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
      .then((data) => setRatings(data))
      .catch((error) => console.error("Error fetching ratings:", error));
  };

  return (
    <div className='pageStyle'>
        <div className='info-book'>
            <img className="cover" src="https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF1000,1000_QL80_.jpg"/>
            <div className='detail-book'>
                <h1 className='title'>{book.title}</h1>
                <p>Author: {book.author.first_name} {book.author.last_name}</p>
                <p>Year Published: {book.year_published}</p>
                <p>
                Rating:{" "}
                {ratings.length > 0
                    ? (ratings.reduce((sum: number, rating: any) => sum + rating.stars, 0) / ratings.length).toFixed(1)
                    : "No ratings yet"}
                </p>
                <p>{book.description}</p>
                <Button sx={{ marginTop: "20px" , backgroundColor: "#61dafb", color: "black", "&:hover": { backgroundColor: "darkblue" } }} onClick={() => setDrawerOpen(true)} variant="contained"> Ratings </Button>
                <Button className='button'> Edit </Button>
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
  );
};

export default BookById;
