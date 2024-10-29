import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from '../ui-management/components/paginator/paginator.component';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, PaginatorComponent],
})
export class ImportDataComponent {}
