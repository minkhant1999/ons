import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  options = ['Reuse', 'Revoke'];
  selectedOption: string = 'Reuse';

  detail: any;
  id: any;
  constructor(
    private _dialogRef: MatDialogRef<CustomerEditComponent>,

    private _customer: CustomersService,
    private _alert: AlertService
  ) { }

  ngOnInit(): void {
    this.id = this._customer.getId();
    this._customer.getCustomerDetail(this.id).subscribe((data: any) => {
      this.detail = data.result;
      this.selectedOption = data.result.status;
    });
  }

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
    let _status: any;
    if (this.selectedOption === 'Reuse') {
      _status = 'REUSE';
    } else {
      _status = 'REVOKE';
    }

    let body = {
      requestId: Date.now().toString(),
      requestTime: Date.now().toString(),
      status: _status,
    };
    this._customer.editStatus(body, this.id).subscribe(
      (data: any) => {
        this._alert.confirmSuccessFail(
          'SUCCESS!',
          'You changed the status successfully.',
          'SUCCESS'
        );
      },
      (err) => {
        this._alert.confirmSuccessFail(
          'FAILED!',
          'Something went wrong.',
          'FAIL'
        );
      }
    );
  }
}
