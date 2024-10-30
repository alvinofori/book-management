import { Component, inject, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
} from '@angular/material/snack-bar';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  constructor(private snackBarService: SnackbarService){}

  ngOnInit(): void {
    this.snackBarService.getSnackBarMessage().subscribe(msg => {
      this._snackBar.open(msg, "Dismiss", {duration: 3000});
    })
    
  }

}
