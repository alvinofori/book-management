import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Book } from '../models/book.model';

export const BooksActions = createActionGroup({
    source: 'Book',
    events: {
        'Load Books': emptyProps,
        'Add Book' : props<{ book: Book }>(),
        'Update Book': props<{ book: Book }>(),
        'Delete Book' : props<{ id: string }>(),
        'Set Search Query' : props<{ query: string }>(),
        'Set Loading': props<{ loading: boolean }>(),

    }
})

export const BookApiActions = createActionGroup({
    source: 'Book API',
    events: {
        'Load Books Success': props<{ books: Book[] }>(),
        'Load Books Failure': props<{ error: string }>(),
    }
})
