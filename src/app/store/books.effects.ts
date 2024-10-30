import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { BookApiActions, BooksActions } from './books.actions';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';
import { select, Store } from '@ngrx/store';
import { selectBooks } from './book.selectors';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class BooksEffects {
  constructor(private actions$: Actions, private bookService: BookService, private store: Store, private snackBackService: SnackbarService) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.loadBooks),
      tap(() => this.store.dispatch(BooksActions.setLoading({ loading: true }))),
      mergeMap(() =>
        this.bookService.getBooks().pipe(
          map((books) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            return BookApiActions.loadBooksSuccess({ books })
          }),
          catchError(() => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            return of({ type: '[Books] Load Books Failed' })
          })
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.addBook),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      tap(() => this.store.dispatch(BooksActions.setLoading({ loading: true }))),
      mergeMap(([{ book }, currentBooks]) =>
        this.bookService.addBook(book).pipe(
          map((newBook: Book) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            this.snackBackService.setSnackBarMessage("Book added successfully");
            return BookApiActions.loadBooksSuccess({ books: [...currentBooks, newBook] });
          }),
          catchError((error) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            this.snackBackService.setSnackBarMessage("Failed to add a book");
            return of(BookApiActions.loadBooksFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.deleteBook),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      tap(() => this.store.dispatch(BooksActions.setLoading({ loading: true }))),
      mergeMap(([book, currentBooks]) =>
        this.bookService.deleteBook(book.id).pipe(
          map((response: { success: boolean; id: string }) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            if(response.success) {
              this.snackBackService.setSnackBarMessage("Book deleted successfully");
              return BookApiActions.loadBooksSuccess({ books: currentBooks.filter(book => book.id !== response.id) });
            } else {
              this.snackBackService.setSnackBarMessage("Failed to delete the book");
              return BookApiActions.loadBooksFailure({ error: 'Failed to delete book' });
            }
          }),
          catchError((error) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            this.snackBackService.setSnackBarMessage(error);
            return of(BookApiActions.loadBooksFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BooksActions.updateBook),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      tap(() => this.store.dispatch(BooksActions.setLoading({ loading: true }))),
      mergeMap(([{book}, currentBooks]) =>
        this.bookService.updateBook(book).pipe(
          map((updatedBook: Book) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            this.snackBackService.setSnackBarMessage("Book updated successfully");
            return BookApiActions.loadBooksSuccess({ books: currentBooks.map((b) => (b.id === book.id ? book : b)) });
            
          }),
          catchError((error) => {
            this.store.dispatch(BooksActions.setLoading({ loading: false }));
            this.snackBackService.setSnackBarMessage("Failed to update the book");
            return of(BookApiActions.loadBooksFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
