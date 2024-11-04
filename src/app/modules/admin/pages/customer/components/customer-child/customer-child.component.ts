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
  ],
})
export class CustomerChildComponent implements OnInit, OnDestroy {
  // pageSize = 10;
  // pageNo = 1;
  // totalPages = 0;
  offset: number = 0;
  size: number = 10;
  totalOffset: number = 0;
  searchForm!: FormGroup;
  results: any[] = [];

  public conditionRole: string = '';

  _dialogRef!: MatDialogRef<any>;
  dataSourcePending = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Pending',
    },
  ];

  dataSourceRevoke = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Revoke',
    },
  ];

  dataSourceReuse = [
    {
      no: 1,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
    {
      no: 2,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
    {
      no: 3,
      account: 'ayy_gftfh_htetnhm1',
      totalMoney: 1000,
      d2dVmy: 'VMY018499',
      status: 'Reuse',
    },
  ];
  currentDataSource = this.dataSourcePending;
  activeButton = '';

  constructor(
    private dialog: MatDialog,
    private _statisticChildGetSetService: StatisticChildGetSetService,
    private _customer: CustomersService,
    private cookieService: CookieService,
    private fb: FormBuilder
  ) {}

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

  showDataSource(dataSource: any[], button: string) {
    this.currentDataSource = dataSource;
    this.activeButton = button;

    this._customer
      .getCustomerStatus({ status: this.activeButton })
      .subscribe((data: any) => {
        this.results = data.result.content;
      });
  }

  showDetail(id: any) {
    this._customer.setId(id);
    this._dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: '50%',
      disableClose: true,
    });
  }

  openEdit(id: any) {
    this._customer.setId(id);
    this._dialogRef = this.dialog.open(CustomerEditComponent, {
      width: '50%',
      disableClose: true,
    });
  }

  getAllCustomers(offset: number = 0) {
    let search = cloneDeep(this.searchForm.value);
    search.page = this.offset = offset;
    search.size = this.size;
    search.status = this.activeButton;
    if (search.status === undefined) {
      search.status = '';
    } else {
      search.status = search.status.toUpperCase();
    }
    this._customer.getCustomers(search).subscribe((data: any) => {
      this.results = data.result.content;
      this.totalOffset = data.result.totalPages - 1;
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
    this._customer.download().subscribe((data: any) => {
      if (data.status === 200) {
        console.log('mother fucker');
        const blob = data.body!;
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = 'CUSTOMER.xlsx';
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    });
  }
}
