import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookDetailsComponent } from "./components/book-details/book-details.component";
import { BookListComponent } from "./components/book-list/book-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookDetailsComponent, BookListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'book-management';
}
