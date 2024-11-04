import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CustomersService } from '../../customer-child/customers.service';
import { AlertService } from 'src/app/modules/service/alert.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CustomerEditComponent implements OnInit {
  options = ['REUSE', 'REVOKE'];
  selectedOption: string = '';
  @Output() editSuccess = new EventEmitter<string>()

  detail: any;
  id: any;
  constructor(
    private _dialogRef: MatDialogRef<CustomerEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _customer: CustomersService,
    private _alert: AlertService
  ) {
    this.id = data.id

    this._customer.getCustomerDetail(this.id).subscribe((data: any) => {
      if (data.errorCode === "00000") {
        this.detail = data.result;
        this.selectedOption = data.result.status;
      } else {
        this._alert.confirmSuccessFail(
          'FAILED!',
          data.message,
          'FAIL'
        );
      }
    });
  }

  ngOnInit(): void { }

  closeEdit() {
    this._dialogRef.close();
  }

  getStatus() {
    //
  }

  update() {
    this._alert
      .confirmSuccessFail(
        'Confirm',
        'Are you sure do you want to update?',
        'SURE'
      )
      .subscribe((value: any) => {
        if (value) {
          this.confirmUpdate();
        }
      });
  }

  confirmUpdate() {

    let body = {
      requestId: Date.now().toString(),
      requestTime: Date.now().toString(),
      status: this.selectedOption,
    };
    this._customer.editStatus(body, this.id).subscribe(
      (data: any) => {
        if (data.errorCode === "00000") {
          this._alert.confirmSuccessFail(
            'SUCCESS!',
            data.message,
            'SUCCESS'
          );
          this.closeEdit();
          this.editSuccess.emit('success')
        } else {
          this._alert.confirmSuccessFail(
            'FAILED!',
            data.message,
            'FAIL'
          );
        }

      },
      (err) => {
        this._alert.confirmSuccessFail(
          'FAILED!',
          'Something went wrong.',
          'FAIL'
        );
        this.closeEdit();
      }
    );
  }
}
