import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { StatisticService } from '../../statistic.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-extra-table-detail',
  templateUrl: './extra-table-detail.component.html',
  styleUrls: ['./extra-table-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class ExtraTableDetailComponent implements OnInit {
  vmy: any;
  public conditionRole = '';
  constructor(
    private service: StatisticService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ExtraTableDetailComponent>,
    private cookieService: CookieService
  ) {
    this.vmy = data.vmy;
  }
  extraTableData: any[] = [];
  ngOnInit(): void {
    this.conditionRole = this.cookieService.get('role');
    if (this.conditionRole === 'HO') {
      this.service.extraTable({ branch: this.vmy }).subscribe((data: any) => {
        if (data.errorCode === '00000') {
          this.extraTableData = data.result;
        }
      });
    } else if (this.conditionRole === 'BCM') {
      this.service
        .extraTable({ fbbLeaderVMY: this.vmy })
        .subscribe((data: any) => {
          if (data.errorCode === '00000') {
            this.extraTableData = data.result;
          }
        });
    } else if (this.conditionRole === 'BM') {
      this.service.extraTable({ bc: this.vmy }).subscribe((data: any) => {
        if (data.errorCode === '00000') {
          this.extraTableData = data.result;
        }
      });
    }
  }
  closeEdit() {
    this._dialogRef.close();
  }
}
