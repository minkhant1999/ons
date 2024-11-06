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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-import-data-child',
  templateUrl: './import-data-child.component.html',
  styleUrls: ['./import-data-child.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PaginatorComponent,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class ImportDataChildComponent implements OnInit {
  _dialogRef!: MatDialogRef<any>;
  public tableData: any;
  offset: number = 0;
  size: number = 10;
  totalOffset: number = 0;
  isLoading: boolean = false;
  constructor(
    private dialog: MatDialog,
    private _alert: AlertService,
    private importService: ImportDataService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  openCreate() {
    const screenWidth = window.innerWidth;
    let dialogWidth = '30%';
    if (screenWidth <= 430) {
      dialogWidth = '90%';
    } else if (screenWidth <= 1024) {
      dialogWidth = '50%';
    }
    this._dialogRef = this.dialog.open(CreateDataComponent, {
      width: dialogWidth,
      disableClose: true,
    });
    this._dialogRef.componentInstance.callGetFile.subscribe(
      (message: string) => {
        if (message === 'success') {
          this.getAll();
        }
      }
    );
  }

  getAll(offset: number = 0) {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.tableData = [];
    this.isLoading = true;

    const page = (this.offset = offset);
    const size = this.size;
    this.importService.getFile({ page, size }).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        loadingRef.close();
        this.tableData = data.result.content;
        this.totalOffset = data.result.totalPages - 1;
        this.isLoading = false;
      } else {
        loadingRef.close();
        this.isLoading = false;

        this._alert.notify('Something went wrong!', 'FAIL');
      }
    });
  }

  onDelete(id: any) {
    this._alert
      .deleteNotification(
        'Are u sure?',
        'Do you want to delete this file?',
        'SURE'
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.importService.deleteFile(id).subscribe((res: any) => {
            if (res.errorCode === '00000') {
              this._alert.deleteNotification(
                'SUCCESS!',
                res.message || 'You deleted successfully.',
                'SUCCESS'
              );
              this.getAll();
            } else {
              this._alert.deleteNotification(
                'FAILED!',
                res.message || 'Something went wrong.',
                'FAIL'
              );
            }
          });
        }
      });
  }
}
