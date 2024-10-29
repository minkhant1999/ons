import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class CreateDataComponent implements OnInit {
  fileName: string | null = null;

  constructor(private _dialogRef: MatDialogRef<CreateDataComponent>) {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.name.split('.').pop()?.toLowerCase();

      if (fileType === 'xls' || fileType === 'xlsx') {
        this.fileName = file.name;
      } else {
        alert('Please upload an Excel file (.xls or .xlsx)');
        input.value = '';
      }
    }
  }

  removeFile(): void {
    this.fileName = null;
  }

  closeCreate() {
    this._dialogRef.close();
  }
}
