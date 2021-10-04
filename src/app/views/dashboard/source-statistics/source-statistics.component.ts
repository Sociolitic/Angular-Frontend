import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Subscription } from "rxjs";
import { FeedData } from "../../../shared/models/live-feed.model";
import {
  LiveFeedService,
  nerAggr,
} from "../../../shared/services/live-feed.service";
import { Chart } from "chart.js";
import { LineChartData } from "../../../shared/models/graphs.model";
import { mediaImages } from "../../../shared/constants";
import {
  graphBackgroundColors,
  graphBorderColors,
} from "../../../shared/constants";
Chart.defaults.global.defaultFontColor='#fff';
@Component({
  selector: "app-source-statistics",
  templateUrl: "./source-statistics.component.html",
  styleUrls: ["./source-statistics.component.scss"],
})
export class SourceStatisticsComponent implements OnInit {
  displayedColumns: string[] = ["phrase", "tag", "source"];
  loadingMentions: boolean = true;
  loadingSentiment: boolean = true;
  loadingNer: boolean = true;
  logos = mediaImages;
  selectedProfile: string;
  nerGridSource: MatTableDataSource<nerAggr> = new MatTableDataSource<nerAggr>(
    []
  );
  @ViewChild(MatTable) table:MatTable<nerAggr>;

  @Input() set changeProfile(profile: string) {
    console.log(profile);
    if (profile.length) {
      this.selectedProfile = profile;
      this.nerGridSource.data = [];
      this.startFeed();
    }
  }
  socketConn: Subscription;

  mentionChart: Chart = null;
  sentimentChart: Chart = null;

  constructor(private _feedsvc: LiveFeedService) {}
  
  ngOnInit(): void {
    this.nerGridSource.data = [...this._feedsvc.nerCount];
    this.initializeMentionChart();
    this.initializeSentimentChart();
  }
  initialiseLiveFeed() {
    this.socketConn = this._feedsvc.listen(this.selectedProfile).subscribe(
      (res: FeedData) => {
        if (res) {
          console.log(res);
          const data = res.aggregate;
          this.updateMentionChart(data["sources"]);
          this.updateSentimentChart(data["sentiment"]);
          if (data["ner"]) {this.nerGridSource.data.push(data["ner"]);
          this.table.renderRows();}
        }
      },
      (error) => {
        console.log("STREAM ERROR", error);
      }
    );
  }
  @Input() set setStatus(status: boolean) {
    if (status)
      this.stopFeed();
  }
  startFeed() {
    this.stopFeed();
    this.initialiseLiveFeed();
  }
  stopFeed() {
    if (this.socketConn) {
      this.socketConn.unsubscribe();
      this.socketConn = null;
      this.loadingMentions=false;
      this.loadingSentiment=false;
    }
  }
  ngOnDestroy() {
    this.stopFeed();
  }

  initializeMentionChart() {
    console.log("sentiment initialized");
    this.mentionChart = new Chart("mentioncanvas", {
      type: "doughnut",
      
      options: {
        animation:{
          animateRotate:false,
          animateScale:false
        },
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
    if (Object.keys(this._feedsvc.sourceCount).length) {
      this.updateMentionChart(this._feedsvc.sourceCount);
    }
  }
  initializeSentimentChart() {
    console.log("sentiment initialized");
    this.sentimentChart = new Chart("sentimentcanvas", {
      type: "bar",
      data: {
        labels: ["positive", "negative", "neutral"],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        animation:{
          animateRotate:false,
          animateScale:false,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    });
    if (Object.keys(this._feedsvc.sentimentCount).length) {
      this.updateMentionChart(this._feedsvc.sentimentCount);
    }
  }

  updateSentimentChart(sentiment: Object) {
    let data: LineChartData[] = [];
    let counter = 0;
    for (let i in sentiment) {
      data.push({
        data: sentiment[i],
        label: i,
        borderColor: graphBorderColors[counter],
        backgroundColor: graphBackgroundColors[counter],
      });
      counter++;
    }
    this.sentimentChart.data.datasets = data;
    this.sentimentChart.update();
    this.loadingSentiment = false;
  }

  updateMentionChart(mentions: Object) {
    this.mentionChart.data.labels = [];
    let data: number[] = [];
    let colors: string[] = [];
    let counter = 0;
    for (let i in mentions) {
      this.mentionChart.data.labels.push(i);
      data.push(mentions[i]);
      colors.push(graphBackgroundColors[counter]);
      counter++;
    }
    this.mentionChart.data.datasets = [
      {
        data: data,
        backgroundColor: colors,
      },
    ];
    this.mentionChart.update();
    this.loadingMentions = false;
  }
}
