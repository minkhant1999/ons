import { Component } from '@angular/core';
import { SelectComponent } from 'src/app/modules/custom/select/select.component';

@Component({
  selector: 'app-statistic-child',
  templateUrl: './statistic-child.component.html',
  styleUrls: ['./statistic-child.component.scss'],
  standalone: true,
  imports: [SelectComponent]
})
export class StatisticChildComponent {

}
