import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminImgUploadComponent } from 'src/app/modules/custom/admin-img-upload/admin-img-upload.component';
import { ImportDataService } from '../../../import-data.service';
import { AlertService } from 'src/app/modules/service/alert.service';

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
  @Output() callGetFile = new EventEmitter<string>();

  constructor(
    private _dialogRef: MatDialogRef<CreateDataComponent>,
    private fb: FormBuilder,
    private importService: ImportDataService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      file: [null, Validators.required],
    });
  }

  onImageSelected(file: File | null) {
    this.createForm.get('file')?.setValue(file);
  }
  onFileRemoved() {
    this.createForm.get('file')?.setValue(null);
  }
  closeCreate() {
    this.createForm.setValue({
      file: '',
    });
    this._dialogRef.close();
  }

  createData() {
    this._alert
      .confirmSuccessFail(
        'ARE U SURE?',
        'Do you want to create this file.',
        'SURE'
      )
      .subscribe((res: boolean) => {
        if (res) {
          this._dialogRef.close();
          const formData = new FormData();
          formData.append('file', this.createForm.get('file')?.value);

          this.importService.importExcel(formData).subscribe((data: any) => {
            if (data.errorCode === '00000') {
              this._alert.confirmSuccessFail(
                'SUCCESS',
                'Your file successfully created.',
                'SUCCESS'
              );
              this.callGetFile.emit('success');
            } else {
              this._alert.confirmSuccessFail(
                'FAILED',
                'Something went wrong.',
                'FAIL'
              );
            }
          });
        }
      });
  }
}
