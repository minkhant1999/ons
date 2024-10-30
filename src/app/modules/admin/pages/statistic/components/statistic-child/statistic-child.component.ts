import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';
import { StatisticChildGetSetService } from './statistic-child-get-set.service';
import { StatisticService } from '../../statistic.service';

interface SelectStatusType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-statistic-child',
  templateUrl: './statistic-child.component.html',
  styleUrls: ['./statistic-child.component.scss'],
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule, MatIconModule, CommonModule],
})
export class StatisticChildComponent implements OnInit {
  searchTable!: FormGroup;
  staticData: any[] = [];
  public branchStatus: SelectStatusType[] = [];
  public townShipStatus: SelectStatusType[] = [];
  public fbbLeaderStatus: SelectStatusType[] = [];
  public d2dStaus: SelectStatusType[] = [];
  public items = [
    {
      label: 'Target',
      backgroundColor: 'bg-[#e4e4e4]',
      value1: '-',
      value2: 1000,
      percentage: '100%',
      check: 'targe',
    },
    {
      label: 'Total Revoke',
      backgroundColor: 'bg-[#A1CDFF]',
      value1: '-',
      value2: 90,
      percentage: '90%',
      check: 'Revoke',
    },
    {
      label: 'Total Reuse',
      backgroundColor: 'bg-[#EBC1FF]',
      value1: '-',
      value2: 10,
      percentage: '1%',
      check: 'Reuse',
    },
    {
      label: 'Total Pending',
      backgroundColor: 'bg-[#F8F49B]',
      value1: '-',
      value2: 900,
      percentage: '50%',
      check: 'Pending',
    },
  ];

  constructor(
    private statisticService: StatisticService,
    private fb: FormBuilder,
    private router: Router,
    private _statisticChildGetSetService: StatisticChildGetSetService
  ) {
    this.branchStatus = [
      { value: 'TEST', label: 'test' },
      { value: 'TEST1', label: 'test1' },
      { value: 'TEST2', label: 'test2' },
    ];

    this.townShipStatus = [
      { value: 'Yangon', label: 'Yangon' },
      { value: 'Bago', label: 'Bago' },
      { value: 'MDL', label: 'MDL' },
    ];

    this.fbbLeaderStatus = [
      { value: 'Yung', label: 'Yung' },
      { value: 'Ming', label: 'Ming' },
      { value: 'Qing', label: 'Qing' },
    ];

    this.d2dStaus = [
      { value: 'Telenor', label: 'Telenor' },
      { value: 'MyTel', label: 'MyTel' },
      { value: 'Ooredoo', label: 'Ooredoo' },
    ];
  }

  ngOnInit(): void {
    this.searchTable = this.fb.group({
      status: [''],
      township: [''],
      fbbLeader: [''],
      d2d: [''],
    });

    this.statisticService.getStatistic().subscribe((data: any) => {
      if (data.errorCode === '00000') {
        this.staticData = data.result;
        console.log(this.staticData, 'this is the data from api');
      }
    });
  }

  searchButton() {
    console.log(this.searchTable.value, ' search table');
  }

  gotoDetailPage(item: any) {
    this._statisticChildGetSetService.setStatistic(item);
    this.router.navigate(['admin/app-customer']);
  }
}
