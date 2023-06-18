import { DashboardService } from './../services/dashboard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  currentStats: any = {};

  ngOnInit(): void {
    this.getCurrentStats();
  }


  getCurrentStats() {
    this.dashboardService.getStats().subscribe(
      (stats) => {
        this.currentStats = stats;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

