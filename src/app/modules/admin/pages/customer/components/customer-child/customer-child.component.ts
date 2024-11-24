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
import { AutoCompleteComponent } from 'src/app/modules/custom/auto-complete/auto-complete.component';
import { StatisticService } from '../../../statistic/statistic.service';
interface SelectStatusType {
  value: string;
  label: string;
}
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
    AutoCompleteComponent,
  ],
})
export class CustomerChildComponent implements OnInit, OnDestroy {
  offset: number = 0;
  size: number = 10;
  public insertD2DValue: string = '';

  totalOffset: number = 0;
  searchForm!: FormGroup;
  searchTable!: FormGroup;
  public D2DCheck: boolean = false;
  results: any[] = [];
  isLoading: boolean = false;
  public isDataLoaded = false;
  public customerData: SelectStatusType[] = [];
  public townshipData: SelectStatusType[] = [];
  public fbbLeaderData: SelectStatusType[] = [];
  public b2bData: SelectStatusType[] = [];
  public conditionRole: string = '';
  _dialogRef!: MatDialogRef<any>;
  activeButton = '';
  public refillData = '';
  matchedData: any;
  matchedDataD2d: any;
  matchedDataHO: any;
  public isDropdownOpen = false;

  branch: any;
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  constructor(
    private dialog: MatDialog,
    private _statisticChildGetSetService: StatisticChildGetSetService,
    private _customer: CustomersService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private _alert: AlertService,
    private statisticService: StatisticService
  ) {}

  ngOnInit(): void {
    this.conditionRole = this.cookieService.get('role');
    this.searchTable = this.fb.group({
      branch: [''],
      township: [''],
      fbbLeaderVmy: [''],
      d2dVmy: [''],
      ftthAccount: [''],
    });
    // this.searchForm = this.fb.group({
    //   branch: [''],
    //   township: [''],
    //   fbbLeaderVmy: [''],
    //   d2dVmy: [''],
    // });
    // this._statisticChildGetSetService.checkStatistic.subscribe(
    //   (data: string) => {
    //     this.activeButton = data;
    //   }
    // );
    this._statisticChildGetSetService.checkStatistic.subscribe((data) => {
      this.activeButton = data?.item;
      this.branch = data?.branch;
      this.data1 = data?.data1;
      this.data2 = data?.data2;
      this.data3 = data?.data3;
      this.data4 = data?.data4;
    });

    this.conditionRole = this.cookieService.get('role');
    const res = this.cookieService.get('vmyCode');

    if (this.conditionRole === 'HO' || this.conditionRole === 'BM') {
      this.statisticService.getBranch().subscribe((data: any) => {
        if (data.errorCode === '00000') {
          const result = data.result;
          this.customerData = result.map((item: string) => ({
            value: item,
            label: item,
          }));
          if (this.conditionRole === 'BM') {
            this.refillData = this.customerData[0].value;
            this.initialState(this.customerData[0].value);
          } else {
            if (this.branch === undefined) {
                this.initialState();
            }
            else {
              const matchedData = this.customerData.filter((item) =>
                this.branch.includes(item.value)
              );
              this.refillData = matchedData[0].value;
              this.initialState(matchedData[0].value);
            }
          }
          this.isDataLoaded = true;
        } else {
          this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
        }
      });
    } else if (this.conditionRole === 'BCM') {
      this.statisticService.getTownship().subscribe((data: any) => {
        if (data.errorCode === '00000') {
          const result = data.result;
          this.townshipData = result?.map((item: string) => ({
            value: item,
            label: item,
          }));

          if (this.data1 === undefined) {
            this.refillData = this.townshipData[0].value;
            this.initialState(this.townshipData[0].value);
          } else {
            const matchedData = this.townshipData.filter((item) =>
              this.data1.includes(item.value)
            );

            this.refillData = matchedData[0].value;
            this.initialState(matchedData[0].value);
          }

          this.isDataLoaded = true;
        } else {
          this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
        }
      });
    } else if (this.conditionRole === 'FBB_LEADER') {
      this.statisticService.getFBBLeader().subscribe((data: any) => {
        if (data.errorCode === '00000') {
          const result = data.result;
          this.fbbLeaderData = result?.map((item: any) => ({
            value: item.FULL_NAME,
            label: item.VMY_CODE,
          }));

          this.refillData = this.fbbLeaderData[0].value;
          this.initialState(this.fbbLeaderData[0].label);

          this.isDataLoaded = true;
        } else {
          this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
        }
      });
    } else if (this.conditionRole === 'D2D') {
      this.D2DCheck = true;
      this.statisticService
        .getD2D({ fbbLeaderVmyCode: res })
        .subscribe((data: any) => {
          if (data.errorCode === '00000') {
            const result = data.result;
            this.b2bData = result?.map((item: any) => ({
              value: item.FULL_NAME,
              label: item.VMY_CODE,
            }));

            this.insertD2DValue = this.b2bData[0].label;
            this.searchTable?.get('d2dVmy')?.setValue(this.b2bData[0].value);

            this.getAllCustomers();
            this.isDataLoaded = true;
          } else {
            this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
          }
        });
    }
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
    let dialogWidth;

    if (screenWidth < 430) {
      dialogWidth = '95%';
    } else if (screenWidth > 1024) dialogWidth = '50%';

    this._dialogRef = this.dialog.open(CustomerDetailComponent, {
      width: dialogWidth,
      height: 'auto',
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

    let search = cloneDeep(this.searchTable.value);

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
    if(
      this.matchedData
    ) {
    search.fbbLeaderVmy = this.matchedData[0].label;
      
    }
    
    if (this.matchedDataD2d) {
    search.d2dVmy = this.matchedDataD2d[0].label;
    }
    else if (this.matchedDataD2d === undefined || this.matchedDataD2d === null) {
       search.d2dVmy = '';
    }
    
    if (this.D2DCheck) search.d2dVmy = this.insertD2DValue;
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

  onSuggestionSelected(selectedBranch: any) {
    this.fbbLeaderData = [];
    this.b2bData = [];
    this.townshipData = [];
    if (
      this.fbbLeaderData.length === 0 &&
      this.b2bData.length === 0 &&
      this.townshipData.length === 0
    ) {
      this.searchTable.get('fbbLeaderVmy')?.setValue('');
      this.searchTable.get('d2dVmy')?.setValue('');
      this.searchTable.get('township')?.setValue('');
    }
    let params = {
      branchCode: selectedBranch.label,
    };
    this.statisticService.getTownship(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result;
        this.townshipData = result?.map((item: string) => ({
          value: item,
          label: item,
        }));

        this.matchedData = this.townshipData.filter((item) =>
          this.data1.includes(item.label)
        );
        this.refillData = this.matchedData[0].value;
        this.getAllCustomers();
      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
    this.searchTable.get('branch')?.setValue(selectedBranch.value);
  }
  onTownshipSelected(selectedTownship: any) {
    this.fbbLeaderData = [];
    this.b2bData = [];
    if (this.fbbLeaderData.length === 0 && this.b2bData.length === 0) {
      this.searchTable.get('fbbLeaderVmy')?.setValue('');
      this.searchTable.get('d2dVmy')?.setValue('');
    }
    let params = {
      township: selectedTownship.label,
    };
    this.statisticService.getFBBLeader(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result;
        this.fbbLeaderData = result?.map((item: any) => ({
          value: item.FULL_NAME,
          label: item.VMY_CODE,
        }));
        this.matchedData = this.fbbLeaderData.filter((item) =>
          this.data2.includes(item.label)
        );
        this.refillData = this.matchedData[0].value;
        this.getAllCustomers();
      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });

    this.searchTable.get('township')?.setValue(selectedTownship.value);
  }

  // FBB Leader
  onFBBLeaderSelected(selectedFBBLeader: any) {
    this.b2bData = [];
    if (this.b2bData.length === 0) this.searchTable.get('d2dVmy')?.setValue('');
    let params = {
      fbbLeaderVmyCode: selectedFBBLeader.label,
    };

    this.statisticService.getD2D(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result;
        this.b2bData = result?.map((item: any) => ({
          value: item.FULL_NAME,
          label: item.VMY_CODE,
        }));
        this.matchedDataD2d = this.b2bData.filter((item) =>
          this.data3.includes(item.label)
        );
        this.refillData = this.matchedDataD2d[0].value;
        this.getAllCustomers();

      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
    this.searchTable.get('fbbLeaderVmy')?.setValue(selectedFBBLeader.label);
  }

  // D2D
  onD2DSelected(selectedD2D: any) {
    this.searchTable.get('d2dVmy')?.setValue(selectedD2D.label);
  }

  initialState(value: string = '', offset: number = 0) {
    let params = this.searchTable.value;
    params.page = this.offset = offset;
    params.size = this.size;

    if (this.conditionRole === 'BCM') params.township = value;
    else if (this.conditionRole === 'BM') params.branch = value;
    else if (this.conditionRole === 'FBB_LEADER') params.fbbLeaderVmy = value;
    else if( this.conditionRole === 'HO') params.branch = value
    this._customer.getCustomers(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.results = data.result.content;
        this.totalOffset = data.result.totalPages - 1;

      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }
}
