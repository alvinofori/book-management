import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BooksActions } from '../../store/books.actions';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchControl = new FormControl('');
  filteredProducts$!: Observable<any>;
  value = '';
  constructor(private store: Store) {}
  
  onSearch() {
    this.store.dispatch(BooksActions.setSearchQuery({ query: this.value }));
  }
}
