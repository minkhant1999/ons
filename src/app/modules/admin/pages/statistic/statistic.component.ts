import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatisticService } from './statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class StatisticComponent implements OnInit {
  constructor(private statisticService: StatisticService) {}
  ngOnInit(): void {
    this.statisticService.getStatistic().subscribe((data: any) => {
      console.log(data, 'this is the data');
    });
  }
}
