import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../models/book.model';
import { v4 as uuidv4 } from 'uuid';
import { BookState } from '../../store/books.reducer';
import { Store } from '@ngrx/store';
import { BooksActions } from '../../store/books.actions';
import { BookForm } from '../../models/bookForm.model';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { selectLoading } from '../../store/book.selectors';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent {
  readonly dialogRef = inject(MatDialogRef<AddBookComponent>);
  loading$ = this.store.select(selectLoading);
  constructor(private fb: FormBuilder, private store: Store<{ books: BookState }>) {}
  private destroyRef = inject(DestroyRef);
  bookForm = new FormGroup<BookForm>({
    id: this.fb.nonNullable.control(uuidv4()),
    title: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(50)]),
    author: this.fb.nonNullable.control<string>('', [Validators.required]),
    year: this.fb.nonNullable.control<number>(new Date().getFullYear(), [
        Validators.required,
        yearValidator
    ]),
    description: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(500)]),
    image: this.fb.nonNullable.control<string>('', [Validators.required])
  })


  addBook() {
    this.store.dispatch(BooksActions.addBook({book: this.bookForm.value as Book}));
    this.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((loading) => {
      if (!loading) {
        this.dialogRef.close();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.bookForm.patchValue({ image: base64String });
      };

      reader.onerror = (error) => {
        console.error('File reading error: ', error);
      };
    }
  }
}

function yearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const currentYear = new Date().getFullYear();
  const isValidYear = /^\d{4}$/.test(value) && value >= 1000 && value <= currentYear;
  return isValidYear ? null : { invalidYear: true };
}
