import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { StatisticChildGetSetService } from './statistic-child-get-set.service';
import { StatisticService } from '../../statistic.service';
import { AutoCompleteComponent } from 'src/app/modules/custom/auto-complete/auto-complete.component';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

type DataField = 'townshipData' | 'fbbLeaderData' | 'b2bData';
interface SelectStatusType {
  value: string;
  label: string;
}

interface SelectStatistic {
  label: string,
  value2: number,
  percentage: string,
  backgroundColor: string
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
  ],
})
export class StatisticChildComponent implements OnInit {
  searchTable!: FormGroup;
  staticData: any[] = [];
  public conditionRole = ''

  public branchStatus: SelectStatusType[] = [];
  public townShipStatus: SelectStatusType[] = [];
  public fbbLeaderStatus: SelectStatusType[] = [];
  public d2dStaus: SelectStatusType[] = [];
  public items: SelectStatistic[] = []



  public customerData: SelectStatusType[] = [];
  public townshipData: SelectStatusType[] = [];
  public fbbLeaderData: SelectStatusType[] = [];
  public b2bData: SelectStatusType[] = [];

  constructor(
    private statisticService: StatisticService,
    private fb: FormBuilder,
    private router: Router,
    private _statisticChildGetSetService: StatisticChildGetSetService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.searchTable = this.fb.group({
      branch: [''],
      township: [''],
      fbbLeaderName: [''],
      d2dName: ['']
    });

    this.conditionRole = this.cookieService.get('role');
    console.log(this.conditionRole, ' conditionRole')

    if (this.conditionRole === 'HO' || this.conditionRole === 'BM') {
      this.statisticService.getBranch().subscribe((data: any) => {
        if (data.errorCode === '00000') {
          const result = data.result;
          this.customerData = result.map((item: string) => ({
            value: item,
            label: item
          }))
        }
      });
    } else if (this.conditionRole === 'BCM') {
      this.statisticService.getTownship().subscribe((data: any) => {
        if (data.errorCode === '00000') {
          const result = data.result
          this.townshipData = result?.map((item: string) => ({
            value: item,
            label: item
          }))
        }
      });
    } else if (this.conditionRole === 'FBB_LEADER') {
      console.log('FBB_LEADER ')
    }

  }

  gotoDetailPage(item: any) {
    this._statisticChildGetSetService.setStatistic(item);
    this.router.navigate(['admin/app-customer']);
  }


  // branch
  onSuggestionSelected(selectedBranch: any) {
    this.fbbLeaderData = []
    this.b2bData = []
    this.townshipData = []
    if (this.fbbLeaderData.length === 0 && this.b2bData.length === 0 && this.townshipData.length === 0) {
      this.searchTable.get('fbbLeaderName')?.setValue('')
      this.searchTable.get('d2dName')?.setValue('')
      this.searchTable.get('township')?.setValue('')
    }
    let params = {
      branchCode: selectedBranch.label
    }
    this.statisticService.getTownship(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result
        this.townshipData = result?.map((item: string) => ({
          value: item,
          label: item
        }))
      }
    });
    this.searchTable.get('branch')?.setValue(selectedBranch.value);
  }

  // township
  onTownshipSelected(selectedTownship: any) {
    this.fbbLeaderData = []
    this.b2bData = []
    if (this.fbbLeaderData.length === 0 && this.b2bData.length === 0) {
      this.searchTable.get('fbbLeaderName')?.setValue('')
      this.searchTable.get('d2dName')?.setValue('')
    }
    let params = {
      township: selectedTownship.label
    }
    this.statisticService.getFBBLeader(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result
        this.fbbLeaderData = result?.map((item: string) => ({
          value: item,
          label: item
        }))
      }
    });
    this.searchTable.get('township')?.setValue(selectedTownship.value);
  }

  // FBB Leader
  onFBBLeaderSelected(selectedFBBLeader: any) {
    this.b2bData = []
    if (this.b2bData.length === 0) this.searchTable.get('d2dName')?.setValue('')
    let params = {
      fbbLeaderVMYCode: selectedFBBLeader.value
    }

    this.statisticService.getD2D(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        const result = data.result
        this.b2bData = result?.map((item: string) => ({
          value: item,
          label: item
        }))
      }
    });
    this.searchTable.get('fbbLeaderName')?.setValue(selectedFBBLeader.value)
  }

  // D2D
  onD2DSelected(selectedD2D: any) {
    this.searchTable.get('d2dName')?.setValue(selectedD2D.value);
  }



  searchButton() {
    let params = this.searchTable.value

    this.statisticService.geStatistic(params).subscribe((data: any) => {
      const backgroundColors = [
        'bg-[#e4e4e4]',
        'bg-[#A1CDFF]',
        'bg-[#EBC1FF]',
        'bg-[#F8F49B]'
      ];

      if (data.errorCode === '00000') {
        const result = data.result
        this.items = result?.map((item: any, index: number) => ({
          label: item.name,
          value2: item.count,
          percentage: item.percentage,
          backgroundColor: backgroundColors[index % backgroundColors.length]
        }));
      }
    })
  }
}


// private handleSelection(
//   selectedItem: any,
//   formControlName: string,
//   serviceMethod: (params: any) => Observable<any>,
//   resultDataField: DataField | null = null
// ) {
//   const params = { [formControlName]: selectedItem.label };

//   serviceMethod(params).subscribe((data: any) => {
//     if (data.errorCode === '00000') {
//       const result = data.result;
//       if (resultDataField) {
//         (this as any)[resultDataField] = result?.map((item: string) => ({
//           value: item,
//           label: item
//         }));
//       }
//     }
//   });

//   this.searchTable.get(formControlName)?.setValue(selectedItem.value);
// }

// branch
// onSuggestionSelected(selectedBranch: any) {
//   this.handleSelection(selectedBranch, 'branch', this.statisticService.getTownship.bind(this.statisticService), 'townshipData');
// }

// // township
// onTownshipSelected(selectedTownship: any) {
//   this.handleSelection(selectedTownship, 'township', this.statisticService.getFBBLeader.bind(this.statisticService), 'fbbLeaderData');
// }

// // FBB Leader
// onFBBLeaderSelected(selectedFBBLeader: any) {
//   this.handleSelection(selectedFBBLeader, 'fbbLeader', this.statisticService.getD2D.bind(this.statisticService), 'b2bData');
// }

// // D2D
// onD2DSelected(selectedD2D: any) {
//   this.searchTable.get('b2b')?.setValue(selectedD2D.value);
// }