import { Component } from '@angular/core';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
  standalone: true,
  imports: [SelectComponent],
})
export class StatisticComponent {}
