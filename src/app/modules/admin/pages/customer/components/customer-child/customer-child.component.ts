import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomerDetailComponent } from '../model/customer-detail/customer-detail.component';
import { CustomerEditComponent } from '../model/customer-edit/customer-edit.component';
import { CustomersService } from './customers.service';
import { StatisticChildGetSetService } from '../../../statistic/components/statistic-child/statistic-child-get-set.service';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { CookieService } from 'ngx-cookie-service';
import { cloneDeep } from 'lodash';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { CustomerRecieveEditComponent } from '../model/customer-recieve-edit/customer-recieve-edit.component';

@Component({
  selector: 'app-customer-child',
  templateUrl: './customer-child.component.html',
  styleUrls: ['./customer-child.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    PaginatorComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
})
export class CustomerChildComponent implements OnInit, OnDestroy {
  offset: number = 0;
  size: number = 10;
  totalOffset: number = 0;
  searchForm!: FormGroup;
  results: any[] = [];
  isLoading: boolean = false;
  public conditionRole: string = '';
  _dialogRef!: MatDialogRef<any>;
  activeButton = '';

  public isDropdownOpen = false;

  constructor(
    private dialog: MatDialog,
    private _statisticChildGetSetService: StatisticChildGetSetService,
    private _customer: CustomersService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private _alert: AlertService
  ) { }

  ngOnInit(): void {
    this.conditionRole = this.cookieService.get('role');
    this.searchForm = this.fb.group({
      ftthAccount: [''],
    });
    this._statisticChildGetSetService.checkStatistic.subscribe(
      (data: string) => {
        this.activeButton = data;
      }
    );
    this.getAllCustomers();
  }

  showDataSource(button: string) {
    this.isLoading = true;
    this.results = [];
    this.activeButton = button;

    let search = {
      page: 0,
      size: 0,
      status: button,
    };

    this._customer.getCustomerStatus(search).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.results = data.result.content;
        this.totalOffset = data.result.totalPages - 1;
        this.offset = 0;
        this.isLoading = false;
      } else {
        this.results = [];
        this.isLoading = false;

        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }

  showDetail(id: any) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let dialogWidth;
    let dialogHeight;

    if (screenWidth < 430 && screenHeight < 700) {
      dialogWidth = '95%';
      dialogHeight = '90%';
    } else if (screenWidth > 1024) dialogWidth = '50%';

    this._dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: dialogWidth,
      height: dialogHeight,
      disableClose: false,
      data: { id: id },
    });
  }

  openEdit(id: any) {
    const screenWidth = window.innerWidth;
    let dialogWidth;
    if (screenWidth < 430) dialogWidth = '95%';
    else if (screenWidth > 1024) dialogWidth = '50%';

    this._dialogRef = this.dialog.open(CustomerEditComponent, {
      width: dialogWidth,
      disableClose: false,
      data: { id: id },
    });
    this._dialogRef.componentInstance.editSuccess.subscribe(
      (message: string) => {
        if (message === 'success') this.getAllCustomers();
      }
    );
  }
  openRecieve(id: any, status: any) {
    console.log(id, ' - ', status, 'hahah');
    const screenWidth = window.innerWidth;
    let dialogWidth;
    if (screenWidth < 430) dialogWidth = '95%';
    else if (screenWidth > 1024) dialogWidth = '50%';

    if (status === 'REVOKE') {
      this._dialogRef = this.dialog.open(CustomerRecieveEditComponent, {
        width: dialogWidth,
        disableClose: true,
        data: { id: id, status: status },
      });
      this._dialogRef.componentInstance.editSuccess.subscribe(
        (message: string) => {
          if (message === 'success') this.getAllCustomers();
        }
      );
    } else if (status === 'RECEIVED_ONU') {
      this._alert.confirmSuccessFail(
        'can’t update again!',
        'You already updated the status.',
        'RECEIVED_ONU'
      );
    } else {
      this._alert.confirmSuccessFail(
        'Warning!',
        'Only revoke status can update.',
        'WARNING'
      );
    }
  }
  getAllCustomers(offset: number = 0) {
    this.results = [];
    this.isLoading = true;

    let search = cloneDeep(this.searchForm.value);
    let status = '';

    if (
      ['PENDING', 'REUSE', 'REVOKE', 'RECEIVED_ONU'].includes(this.activeButton)
    )
      status = this.activeButton;
    else if (this.activeButton !== 'TARGET' && this.activeButton !== undefined)
      status = '';

    search.page = this.offset = offset;
    search.size = this.size;
    search.status = status ? status.toUpperCase() : '';

    this._customer.getCustomers(search).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.isLoading = false;
        this.results = data.result.content;
        this.totalOffset = data.result.totalPages - 1;
      } else {
        this.isLoading = false;
        this.results = [];
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }

  ngOnDestroy(): void {
    this._statisticChildGetSetService.clearStatistic();
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.getAllCustomers();
    }
  }

  download() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this._customer.download().subscribe((data: any) => {
      if (data.status === 200) {
        loadingRef.close();
        const blob = data.body!;
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'CUSTOMER.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
        this._alert.confirmSuccessFail(
          'SUCCESS!',
          data.message || 'You downloaded successfully!',
          'SUCCESS'
        );
      }
    });
  }
}
