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
Chart.defaults.global.defaultFontColor='#000';
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
      if(this.selectedProfile.length) {
        this.nerGridSource.data = [];}
      this.selectedProfile = profile;
      
      this.startFeed();
    }
    else{
      this.selectedProfile = '';  
      this.stopFeed();
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
      data:{
        labels:[],
        datasets:[
          {
            
          }
        ]
      },
      options: {
        
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
        labels: ['positive','negative','neutral'],
        datasets:[
        
        ]
      },
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
    console.log('update sentiment',sentiment);
    const l=graphBackgroundColors.length;
    let counter = 0;
    let br=false;
    for (let i in sentiment) {
      if(!br 
        && counter<this.sentimentChart.data.datasets.length 
        && i === this.sentimentChart.data.datasets[counter].label){
          this.sentimentChart.data.datasets[counter].data=sentiment[i];
          console.log('old data');
      }
      else{
        br=true;
      this.sentimentChart.data.datasets.push({
        data: sentiment[i],
        label: i,
        borderColor: graphBorderColors[counter%l],
        backgroundColor: graphBackgroundColors[counter%l],
      });
       }
      counter++;
    }
    this.sentimentChart.update();
    this.loadingSentiment = false;
  }

  updateMentionChart(mentions: Object) {
    const l=graphBackgroundColors.length;
    let data: any[] =[];
    let colors: string[] = [];
    let counter = 0;
    let labels: string[]= []
    for (let i in mentions) {
      labels.push(i);
      data.push(mentions[i]);
      colors.push(graphBackgroundColors[counter%l]);
      counter++;
    }
    this.mentionChart.data.labels=labels;
    this.mentionChart.data.datasets[0].data = data;
    this.mentionChart.data.datasets[0].backgroundColor = colors;
    this.mentionChart.update();
    this.loadingMentions = false;
  }
}
