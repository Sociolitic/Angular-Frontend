import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-source-statistics',
  templateUrl: './source-statistics.component.html',
  styleUrls: ['./source-statistics.component.scss']
})
export class SourceStatisticsComponent implements OnInit {
  isCollapsed= true;
  constructor() { }

  ngOnInit(): void {
  }

}
