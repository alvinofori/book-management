import { Component, inject } from '@angular/core';
import { Book } from '../../models/book.model';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BookState } from '../../store/books.reducer';
import { AsyncPipe } from '@angular/common';
import { BooksActions } from '../../store/books.actions';
import { AddBookComponent } from '../add-book/add-book.component';
import { SearchComponent } from "../search/search.component";
import { selectFilteredBooks, selectLoading } from '../../store/book.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SnackbarComponent } from "../snackbar/snackbar.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [AsyncPipe, SearchComponent, MatButtonModule, MatTableModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, SnackbarComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  books$: Observable<Book[]>;
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['title', 'author', 'year', 'options'];
  isLoading$!: Observable<boolean>;
  constructor(private store: Store<{ books: BookState }>){
    this.books$ = this.store.select(selectFilteredBooks);
  }

  ngOnInit(): void {
    this.store.dispatch(BooksActions.loadBooks());
    this.books$ = this.store.select(selectFilteredBooks);
    this.isLoading$ = this.store.select(selectLoading);
  }

  addBook() {
    this.dialog.open(AddBookComponent, {
      width: '800px'
    })
  }

  openBookDetails(bookID: string): void {
    this.dialog.open(BookDetailsComponent, {
      width: '800px',
      data: bookID,
      enterAnimationDuration: 1,
      exitAnimationDuration: 1,
    });
  }


  deleteBook(id: string): void {
    this.store.dispatch(BooksActions.deleteBook({ id }));
  }

  
}
