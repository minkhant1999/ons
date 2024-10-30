import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from 'src/app/modules/custom/paginator/paginator.component';
import { CreateDataComponent } from '../model/create-data/create-data.component';
import { AlertService } from 'src/app/modules/service/alert.service';
import { ImportDataService } from '../../import-data.service';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';

@Component({
  selector: 'app-import-data-child',
  templateUrl: './import-data-child.component.html',
  styleUrls: ['./import-data-child.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, PaginatorComponent, MatDialogModule],
})
export class ImportDataChildComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;
  public tableData: any;

  constructor(
    private dialog: MatDialog,
    private _alert: AlertService,
    private importService: ImportDataService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  openCreate() {
    this._dialogRef = this.dialog.open(CreateDataComponent, {
      width: '50%',
      disableClose: true,
    });
  }

  getAll() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });

    this.importService.getFile().subscribe((data: any) => {
      if (data.errorCode === '00000') {
        loadingRef.close();
        this.tableData = data.result;
      } else {
        loadingRef.close();
        this._alert.notify('Something went wrong!', 'FAIL');
      }
      console.log(data);
    });
  }

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
