import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminImgUploadComponent } from 'src/app/modules/custom/admin-img-upload/admin-img-upload.component';
import { ImportDataService } from '../../../import-data.service';

@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    AdminImgUploadComponent,
    ReactiveFormsModule,
  ],
})
export class CreateDataComponent implements OnInit {
  createForm!: FormGroup;
  // fileName: string | null = null;

  constructor(
    private _dialogRef: MatDialogRef<CreateDataComponent>,
    private fb: FormBuilder,
    private importService: ImportDataService
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      file: [''],
    });
  }

  onImageSelected(event: any) {}

  closeCreate() {
    this._dialogRef.close();
  }

  createData() {
    const data = this.createForm.value.file.name;

    this.importService.importExcel(data).subscribe((data: any) => {
      console.log(data);
    });
    console.log(this.createForm.value.file.name, ' create form');
  }
}
