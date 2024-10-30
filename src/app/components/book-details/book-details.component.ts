import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { Store } from '@ngrx/store';
import { BookState } from '../../store/books.reducer';
import { BooksActions } from '../../store/books.actions';
import { selectBookById, selectLoading } from '../../store/book.selectors';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BookForm } from '../../models/bookForm.model';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  isEditMode = false;
  readonly dialogRef = inject(MatDialogRef<BookDetailsComponent>);
  readonly bookID = inject<string>(MAT_DIALOG_DATA);
  book$ = new Observable<Book | undefined>;
  $unsubscribe = new Subject<void>;
  bookForm!: FormGroup<BookForm>;
  loading$ = this.store.select(selectLoading);
  private destroyRef = inject(DestroyRef);
  constructor(private bookService: BookService, private store: Store<{ books: BookState }>, private fb: FormBuilder){
    this.book$ = this.store.select(selectBookById(this.bookID));
    this.book$.pipe(takeUntil(this.$unsubscribe)).subscribe(res => {
      this.bookForm = this.fb.group<BookForm>({
        id: this.fb.nonNullable.control({ value: res?.id ?? '', disabled: true }, [Validators.required]),
        title: this.fb.nonNullable.control({ value: res?.title ?? '', disabled: true }, [Validators.required]),
        author: this.fb.nonNullable.control({ value: res?.author ?? '', disabled: true }, [Validators.required]),
        year: this.fb.nonNullable.control({ value: res?.year ?? new Date().getFullYear(), disabled: true }, [
          Validators.required,
          yearValidator
      ]),
        description: this.fb.nonNullable.control({ value: res?.description ?? '', disabled: true }, [Validators.required, Validators.maxLength(500)]),
        image: this.fb.nonNullable.control<string>({ value: res?.image ?? '', disabled: true }, [Validators.required])
      })
    })
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteBook(id: string): void {
    this.store.dispatch(BooksActions.deleteBook({ id }));
    this.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((loading) => {
      if (!loading) {
        this.dialogRef.close();
      }
    });
  }

  saveChanges(): void {
    
    this.store.dispatch(BooksActions.updateBook({book: this.bookForm.value as Book}))
    this.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((loading) => {
      if (!loading) {
        this.isEditMode = false; 
        this.dialogRef.close();
      }
    });

  }

  editBook() {
    this.isEditMode = true;
    this.bookForm.enable();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        this.bookForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file);
    }
  }
}
function yearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const currentYear = new Date().getFullYear();
  const isValidYear = /^\d{4}$/.test(value) && value >= 1000 && value <= currentYear;
  return isValidYear ? null : { invalidYear: true };
}
