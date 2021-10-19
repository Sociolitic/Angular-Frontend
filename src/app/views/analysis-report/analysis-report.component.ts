import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Chart } from "chart.js";
import { ChartDataService } from "../../shared/services/chart-data.service";
import { StatisticsData } from "../../shared/models/graphs.model";
import { LineChartData } from "../../shared/models/graphs.model";
import {
  graphBorderColors,
  graphBackgroundColors,
  graphBackgroundTransparent,
} from "../../shared/constants";
import { User } from "../../shared/models/user.model";
import { BrandRegistrationService } from "../../shared/services/brand-registration.service";
import { AnalyticsService } from "../../shared/services/analytics.service";

@Component({
  selector: "app-analysis-report",
  templateUrl: "./analysis-report.component.html",
  styleUrls: ["./analysis-report.component.scss"],
})
export class AnalysisReportComponent implements OnInit {
  constructor(
    private dataService: ChartDataService,
    private brandReg: BrandRegistrationService,
    private analyticsSvc: AnalyticsService
  ) {}
  loading: boolean = true;
  profiles: object = {};
  selectedProfile: string = "";
  user: User;
  mentionChart: Chart = null;
  sentimentPieChart: Chart = null;
  sentimentBarChart: Chart = null;
  statisticsData: StatisticsData = null;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.brandReg.findProfiles(this.user.profiles, this.user.bearer).subscribe(
      (res) => {
        this.profiles = res;
        this.selectedProfile = this.user.profiles[0];
        this.initializeMentionChart();
        this.initializeSentimentPieChart();
        this.changeProfile();
        this.fetchAnalytics()
      },
      (err) => console.log("error in fetching profiles", err)
    );
  }

  mediaArray = [
    { name: "reddit", mentionCompleted: false, sentimentPieCompleted: false },
    // {name: "insta", mentionCompleted: false, sentimentPieCompleted:false},
    { name: "twitter", mentionCompleted: false, sentimentPieCompleted: false },
    { name: "youtube", mentionCompleted: false, sentimentPieCompleted: false },
    { name: "tumblr", mentionCompleted: false, sentimentPieCompleted: false },
  ];
  pieChartSource = "total";
  allComplete: boolean = false;
  period: string = "hours";

  updateAllComplete(media: any) {
    this.allComplete =
      this.mediaArray != null &&
      this.mediaArray.every((t) => t.mentionCompleted);
    //this.createMentionChart();
  }

  someComplete(): boolean {
    if (this.mediaArray == null) {
      return false;
    }
    return (
      this.mediaArray.filter((t) => t.mentionCompleted).length > 0 &&
      !this.allComplete
    );
  }

  setAll(mentionCompleted: boolean) {
    this.allComplete = mentionCompleted;
    if (this.mediaArray == null) {
      return;
    }
    this.mediaArray.forEach((t) => (t.mentionCompleted = mentionCompleted));
    this.createMentionChart();
  }

  initializeMentionChart() {
    this.mentionChart = new Chart("canvas", {
      type: "line",
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                display: false,
              },
            },
          ],
        },
      },
    });
  }
  initializeSentimentPieChart() {
    this.sentimentPieChart = new Chart("piecanvas", {
      type: "pie",
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }
  createMentionChart() {
    let lineDataset = [];
    let counter = 0;
    //console.log(this.mediaArray);
    this.mediaArray.forEach((source) => {
      if (source.mentionCompleted) {
        let lineData: number[] =
          this.statisticsData[this.period]["sources"][source.name]['total'];
        lineDataset.push({
          data: lineData,
          label: source.name,
          borderColor: graphBorderColors[counter],
          backgroundColor: graphBackgroundTransparent[counter],
        });
        counter++;
      }
    });
    //console.log(lineDataset);
    if (lineDataset.length === 0) {
      lineDataset.push({
        data: this.statisticsData[this.period].total,
        label: "Aggregate",
        borderColor: graphBorderColors[0],
        backgroundColor: graphBackgroundTransparent[0],
      });
    }
    let l = this.statisticsData[this.period]['total'].length;
    if (this.mentionChart) {
      this.mentionChart.data = {
        labels: this.dataService.labels(this.period,l),
        datasets: lineDataset,
      };
      this.mentionChart.update();
    }
  }
  createSentimentPieChart() {
    let source = this.pieChartSource;
    let positiveCount=0;
    let negativeCount=0;
    let neutralCount=0;
    if(source==='total'){
      positiveCount=this.statisticsData[this.period]['positive'].reduce((a, b) => a + b, 0);
      negativeCount=this.statisticsData[this.period]['negative'].reduce((a, b) => a + b, 0);
      neutralCount=this.statisticsData[this.period]['neutral'].reduce((a, b) => a + b, 0);
    }
    else{
      positiveCount = this.statisticsData[this.period]["sources"]
    [source]["positive"].reduce((a, b) => a + b, 0);
     negativeCount = this.statisticsData[this.period]["sources"][
      source
    ]["negative"].reduce((a, b) => a + b, 0);
    neutralCount = this.statisticsData[this.period]["sources"][
      source
    ]["neutral"].reduce((a, b) => a + b, 0);
}
    const pieData: LineChartData[] = [
      {
        data: [positiveCount, negativeCount, neutralCount],
        backgroundColor: graphBackgroundColors.slice(0, 3),
      },
    ];
    if (this.sentimentPieChart) {
      this.sentimentPieChart.data = {
        labels: ["positive", "negative", "neutral"],
        datasets: pieData,
      };
      this.sentimentPieChart.update();
    }
  }
  fetchGraphData() {
    this.loading = true;
    this.dataService.getChartData(this.selectedProfile).subscribe(
      (statData) => {
        this.statisticsData = {
          tag: statData["tag"],
          mins: statData["mins"] ? statData["mins"][0] : null,
          hours: statData["hours"] ? statData["hours"][0] : null,
          days: statData["days"] ? statData["days"][0] : null,
          months: statData["months"] ? statData["months"][0] : null,
          years: statData["years"] ? statData["years"][0] : null,
        };
        console.log(this.statisticsData);
        console.log(statData);
        this.period = 
        this.statisticsData.mins?'mins':
        this.statisticsData.hours?'hours':
        this.statisticsData.days?'days':
        this.statisticsData.months?'months':
        this.statisticsData.years?'years':null;
        this.createMentionChart();
        this.createSentimentPieChart();
        this.loading = false;
      },
      (error) => {
        console.log("error fetching data" + error);
      }
    );
  }
  refreshGraphPeriod(){
    this.createSentimentPieChart();
    this.createMentionChart();
  }
  changeProfile() {
    this.fetchGraphData();
  }

  fetchAnalytics(){
    this.analyticsSvc.brandRecommendations(this.selectedProfile).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }
}
