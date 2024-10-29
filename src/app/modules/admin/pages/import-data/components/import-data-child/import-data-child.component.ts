import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { AlertService } from 'src/app/modules/service/alert.service';

@Component({
  selector: 'app-import-data-child',
  templateUrl: './import-data-child.component.html',
  styleUrls: ['./import-data-child.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, PaginatorComponent],
})
export class ImportDataChildComponent implements OnInit {
  public tableData = [
    {
      id: 1,
      fileName: 'file1.txt',
      reason: 'Check details',
      date: '26/10/2024',
      status: 'Processing',
    },
    {
      id: 2,
      fileName: 'file2.txt',
      reason: 'Check details',
      date: '27/10/2024',
      status: 'Fail',
    },
    {
      id: 3,
      fileName: 'file3.txt',
      reason: 'Check details',
      date: '28/10/2024',
      status: 'Imported',
    },
  ];

  constructor(private _alert: AlertService) {}

  ngOnInit(): void {}

  onDelete() {
    this._alert
      .deleteNotification(
        'Are u sure?',
        'Do you want to delete this file.',
        'SURE'
      )
      .subscribe((result: boolean) => {
        if (result) {
          console.log(result, ' hello world');
        }
      });
  }
}
