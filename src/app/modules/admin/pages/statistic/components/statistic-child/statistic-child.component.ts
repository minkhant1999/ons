import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { StatisticChildGetSetService } from './statistic-child-get-set.service';
import { StatisticService } from '../../statistic.service';
import { AutoCompleteComponent } from 'src/app/modules/custom/auto-complete/auto-complete.component';
import { CookieService } from 'ngx-cookie-service';
import { InputComponent } from 'src/app/modules/custom/input/input.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
import { ExtraTableDetailComponent } from '../extra-table-detail/extra-table-detail.component';

interface SelectStatusType {
  value: string;
  label: string;
}

interface SelectStatistic {
  name: string;
  label: string;
  value2: number;
  percentage: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-statistic-child',
  templateUrl: './statistic-child.component.html',
  styleUrls: ['./statistic-child.component.scss'],
  standalone: true,
  imports: [
    SelectComponent,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    AutoCompleteComponent,
    InputComponent,
  ],
})
export class StatisticChildComponent implements OnInit {
  searchTable!: FormGroup;
  staticData: any[] = [];
  extraTableData: any[] = [];
  public conditionRole = '';
  public refillData = '';
  public isDataLoaded = false;
  _dialogRef!: MatDialogRef<any>;

  public branchStatus: SelectStatusType[] = [];
  public townShipStatus: SelectStatusType[] = [];
  public fbbLeaderStatus: SelectStatusType[] = [];
  public d2dStaus: SelectStatusType[] = [];
  public items: SelectStatistic[] = [];

  public customerData: SelectStatusType[] = [];
  public townshipData: SelectStatusType[] = [];
  public fbbLeaderData: SelectStatusType[] = [];
  public b2bData: SelectStatusType[] = [];

  public D2DCheck: boolean = false;
  public insertD2DValue: string = '';
  role: any;
  isMobile = window.innerWidth <= 430;

  constructor(
    private statisticService: StatisticService,
    private fb: FormBuilder,
    private router: Router,
    private _statisticChildGetSetService: StatisticChildGetSetService,
    private cookieService: CookieService,
    private _alert: AlertService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.role = this.cookieService.get('role');
    this.searchTable = this.fb.group({
      branch: [''],
      township: [''],
      fbbLeaderVmy: [''],
      d2dVmy: [''],
    });
    this.extraTable();

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
            // this.refillData = this.customerData[0].value;
            // this.initialState(this.customerData[0].value);
            this.refillData = '';
            this.initialState();
          } else {
            this.initialState();
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

          // this.refillData = this.townshipData[0].value;
          // this.initialState(this.townshipData[0].value);
          this.refillData = '';
          this.initialState();
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

          // this.refillData = this.fbbLeaderData[0].value;
          // this.initialState(this.fbbLeaderData[0].label);
          this.refillData = '';
          this.initialState();
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

            this.searchButton();
            this.isDataLoaded = true;
          } else {
            this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
          }
        });
    }
  }

  initialState(value: string = '') {
    let params = this.searchTable.value;
    if (this.conditionRole === 'BCM') params.township = value;
    else if (this.conditionRole === 'BM') params.branch = value;
    else if (this.conditionRole === 'FBB_LEADER') params.fbbLeaderVmy = value;

    this.statisticService.geStatistic(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result.sort((a: any, b: any) => {
          if (a.name === 'Target') return -1;
          if (b.name === 'Target') return 1;
          return 0;
        });

        this.items = result?.map((item: any) => ({
          name: item.label,
          label: item.name,
          value2: item.count,
          percentage: item.percentage,
          backgroundColor: this.getBackgroundColor(item.label),
        }));
      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }

  // gotoDetailPage(item: any) {
  //   this._statisticChildGetSetService.setStatistic(item);
  //   const data = this.searchTable.get('branch')?.value;
  //   this._statisticChildGetSetService.setStatistic(data);
  //   this.router.navigate(['admin/app-customer']);
  // }
  gotoDetailPage(item: any) {
    const branch = this.searchTable.get('branch')?.value;
    const data1 = this.searchTable.get('township')?.value;
    const data2 = this.searchTable.get('fbbLeaderVmy')?.value;
    const data3 = this.searchTable.get('d2dVmy')?.value;

    // Create an object with all the data
    const dataToSend = { item, branch, data1, data2, data3 };

    // Set the data in the service
    this._statisticChildGetSetService.setStatistic(dataToSend);

    // Navigate to the second component
    this.router.navigate(['admin/app-customer']);
  }
  // branch
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
      } else {
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
    this.searchTable.get('branch')?.setValue(selectedBranch.value);
  }

  // township
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

  searchButton() {
    const loadingRef = this._dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    let params = this.searchTable.value;
    if (this.D2DCheck) params.d2dVmy = this.insertD2DValue;

    this.statisticService.geStatistic(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result.sort((a: any, b: any) => {
          if (a.name === 'Target') return -1;
          if (b.name === 'Target') return 1;
          return 0;
        });

        this.items = result?.map((item: any) => ({
          name: item.label,
          label: item.name,
          value2: item.count,
          percentage: item.percentage,
          backgroundColor: this.getBackgroundColor(item.label),
        }));
        loadingRef.close();
      } else {
        loadingRef.close();
        this._alert.confirmSuccessFail('FAILED!', data.message, 'FAIL');
      }
    });
  }

  getBackgroundColor(name: string): string {
    switch (name) {
      case 'PENDING':
        return 'bg-[#F8F49B]';
      case 'REUSE':
        return 'bg-[#EBC1FF]';
      case 'REVOKE_NOT_SEND_STOCK':
        return 'bg-[#A1CDFF]';
      case 'Target':
        return 'bg-[#e4e4e4]';
      case 'RECEIVED_ONU':
        return 'bg-[#CBF895]';
      case 'TOTAL_REVOKE':
        return 'bg-[#FFAC8E]';
      default:
        return 'bg-[#e4e4e4]';
    }
  }

  extraTable() {
    this.statisticService.extraTable().subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.extraTableData = data.result;
      }
    });
  }

  getD2D(vmy: any) {
    const screenWidth = window.innerWidth;
    let dialogWidth;
    if (screenWidth < 430) dialogWidth = '95%';
    else if (screenWidth > 1024) dialogWidth = '55%';

    this._dialogRef = this._dialog.open(ExtraTableDetailComponent, {
      width: dialogWidth,
      disableClose: false,
      data: { vmy: vmy },
    });
  }

  goToGuideline() {
    this.router.navigate(['/admin/guideline']);
  }
}
