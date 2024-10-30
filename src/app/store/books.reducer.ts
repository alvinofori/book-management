import { createReducer, on } from '@ngrx/store';
import { BooksActions, BookApiActions } from './books.actions';
import { Book } from '../models/book.model';


export interface BookState {
    books: Book[];
    searchQuery: string;
    loading: boolean;
}
  
const initialBooksState: BookState = {
    books: [],
    searchQuery: '',
    loading: false
};

export const booksReducer = createReducer(
  initialBooksState,
  on(BookApiActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false,
  })),
  // on(BooksActions.addBook, (state, { book }) => ({
  //   ...state,
  //   books: [...state.books, book],
  // })),
  // on(BooksActions.updateBook, (state, { book }) => ({
  //   ...state,
  //   books: state.books.map((b) => (b.id === book.id ? book : b)),
  // })),
  // on(BooksActions.deleteBook, (state, { id }) => ({
  //   ...state,
  //   books: state.books.filter((b) => b.id !== id),
  // })),
  on(BooksActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
    loading: false,
  })),
  on(BooksActions.setLoading, (state, { loading }) => ({
    ...state,
    loading,
  }))
);
