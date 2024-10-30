import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  img1 = 'assets/1.jpg';
  private books: Book[] = [
    { id: '1', title: 'Soul', author: 'Olivia Wilson', year: 2020, description: 'Description of Book One', image: 'assets/1.jpg' },
    { id: '2', title: 'Among the stars', author: 'Matthew K. Wyers', year: 2018, description: 'Description of Book Two', image: 'assets/2.jpg' },
    { id: '3', title: 'The green soldier', author: 'J. Edward Gore', year: 2015, description: 'Description of Book Three', image: 'assets/3.jpg' },
    { id: '4', title: 'In the woods', author: 'Tana French', year: 2022, description: 'Description of Book Four', image: 'assets/4.jpg' },
    { id: '5', title: 'The domestic Goddes', author: 'Sophie Kinsella', year: 2012, description: 'Description of Book Five', image: 'assets/5.webp' },
  ];

  getBooks(): Observable<Book[]> {
    return of(this.books).pipe(delay(1000));
  }

  getBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }
  
  addBook(book: Book): Observable<Book> {
    return of({
      ...book,
    }).pipe(delay(1000));
  }

  updateBook(updatedBook: Book): Observable<Book> {
    return of({
      ...updatedBook,
    }).pipe(delay(1000));
  }

  deleteBook(id: string): Observable<{ success: boolean; id: string }> {
    return of({
      success: true,
      id,
    }).pipe(delay(1000));
  }
}
