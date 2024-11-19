import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { StatisticService } from '../../statistic.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-extra-table-detail',
  templateUrl: './extra-table-detail.component.html',
  styleUrls: ['./extra-table-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class ExtraTableDetailComponent implements OnInit {
  vmy: any;
  constructor(
    private service: StatisticService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<ExtraTableDetailComponent>
  ) {
    this.vmy = data.vmy;
  }
  extraTableData: any[] = [];
  ngOnInit(): void {
    this.service
      .extraTable({ fbbLeaderVMY: this.vmy })
      .subscribe((data: any) => {
        if (data.errorCode === '00000') {
          this.extraTableData = data.result;
        }
      });
  }
  closeEdit() {
    this._dialogRef.close();
  }
}
