export interface Author {
    id:string;
    first_name: string;
    last_name: string;
    books: Book[];
    photo: string;
    biography: string;
  }
  
  export interface Book {
    id: string;
    title: string;
    year_published: number;
    rating: number;
    author: Author;
    onClick: (id: string) => void; // Le rendre optionnel pour éviter les conflits
  }