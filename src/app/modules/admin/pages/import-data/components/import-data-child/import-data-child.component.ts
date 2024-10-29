import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { CreateDataComponent } from '../model/create-data/create-data.component';

@Component({
  selector: 'app-import-data-child',
  templateUrl: './import-data-child.component.html',
  styleUrls: ['./import-data-child.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, PaginatorComponent, MatDialogModule],
})
export class ImportDataChildComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreate() {
    this._dialogRef = this.dialog.open(CreateDataComponent, {
      width: '50%',
      disableClose: true,
    });
  }
}
