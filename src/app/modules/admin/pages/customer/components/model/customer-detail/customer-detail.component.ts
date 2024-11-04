import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CustomersService } from '../../customer-child/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
})
export class CustomerDetailComponent implements OnInit {
  detail: any;
  id: any;
  constructor(
    private _dialogRef: MatDialogRef<CustomerDetailComponent>,
    private _customer: CustomersService
  ) { }

  ngOnInit(): void {
    this.id = this._customer.getId();
    this._customer.getCustomerDetail(this.id).subscribe((data: any) => {
      if (data.errorCode === "00000") {
        this.detail = data.result;
      }

    });
  }

  closeDetail() {
    this._dialogRef.close();
  }
}
