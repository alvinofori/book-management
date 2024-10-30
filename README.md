# BookManagement

This is a book management platform with NgRx store implemention and Angular Material.

## Book List component

contains the list of the books that is being fetched from the Book service throgh NgRx store.

## Add component 

contains the list of fields needed for adding a new book. After submitting the data, it goes through NgRx and send it to the service for backend operation. If we receive a success response, then this book is added to the store

## Book details component

contains the details about the selected book that w

## Search component

searches for the book through out the store either by title or by author

Added loaders and snackbar (toast notifications) for operations (add, delete, update)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
