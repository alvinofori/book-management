import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BookState } from './books.reducer';
import { Book } from '../models/book.model';


export const selectBookState = createFeatureSelector<BookState>('books');

export const selectAllBooks = createSelector(
  selectBookState,
  (state) => state.books
);

export const selectBookById = (id: string) =>
  createSelector(selectAllBooks, (books) => books.find((book) => book.id === id));

export const selectBooks = createSelector(
  selectBookState,
  (state: BookState) => state.books
);

export const selectSearchQuery = createSelector(
  selectBookState,
  (state: BookState) => state.searchQuery
);

export const selectFilteredBooks = createSelector(
  selectBooks,
  selectSearchQuery,
  (books: Book[], searchQuery: string) => {
    if (!searchQuery) {
      return books;
    }
    return books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
);

export const selectLoading = createSelector(
  selectBookState,
  (state: BookState) => state.loading
);