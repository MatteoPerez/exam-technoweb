import React from "react";
import styles from "./bookCard.module.css"
import { Book } from './types'


const BookCard: React.FC<Book> = ({ id, title, year_published, rating, author, onClick }) => {
  return (
    <div key={id} className={styles.bookCard} onClick={() => onClick(id)}>
      <div className={styles.bookImage}>
        <div className={styles.bookCover}>
          <div className={styles.bookInfo}>
            <h2>{title}</h2>
          </div>
        </div>
      </div>
      <div className={styles.bookInfoZone}>
        <h3>{title}</h3>
        <div className={styles.bookDetails}>
        {
        author ? (
          <p>{author.first_name} {author.last_name}</p>
        ) : (
          <p>Unknown Author</p>
        )
      }
          <p>Year: {year_published}</p>
          <p>Rating: {rating}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;