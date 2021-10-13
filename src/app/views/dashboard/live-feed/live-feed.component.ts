import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  ElementRef,
} from "@angular/core";
import { Chart } from "chart.js";
import { filterObj } from "../feed-filter/feed-filter.component";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {
  LiveFeedService,
  nerAggr,
} from "../../../shared/services/live-feed.service";
import { Observable, Subscription, interval } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { User } from "../../../shared/models/user.model";
import { FeedData, feedObject } from "../../../shared/models/live-feed.model";
import { BrandRegistrationService } from "../../../shared/services/brand-registration.service";
import {
  graphBackgroundColors,
  graphBorderColors,
  mediaImages,
} from "../../../shared/constants";
import { DateTimeService } from "../../../shared/services/date-time.service";
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from "@angular/platform-browser";
Chart.defaults.global.defaultFontColor='#000';
export interface feedSource {
  source_name: string;
  source_observable: Observable<feedObject[]>;
  source_sub: Subscription;
}
@Component({
  selector: "app-live-feed",
  templateUrl: "./live-feed.component.html",
  styleUrls: ["./live-feed.component.scss"],
})
export class LiveFeedComponent implements OnInit, OnDestroy {
  logos = mediaImages;
  @ViewChild("tweetContainer") tweetContainer: ElementRef<any>;
  @ViewChild("FeedMatTable") table: MatTable<feedObject>;
  @Input() set changeProfile(profile: string) {
    if (profile.length) {
      if (this.selectedProfile.length) this.dataGridSource.data = [];
      this.selectedProfile = profile;

      this.startFeed();
    } else {
      this.selectedProfile = "";
      this.stopFeed();
    }
  }
  @Input() set applyFilters(filters: filterObj) {
    if (filters) this.dataGridSource.filter = JSON.stringify(filters);
    console.dir(filters);
  }
  tableData: feedObject[] = [];
  more: boolean = false;
  dataGridSource: MatTableDataSource<feedObject> =
    new MatTableDataSource<feedObject>([]);
  displayedColumns = ["source", "text"];
  feedDataSources: {} = {};
  socketConn: Subscription;
  showCard: boolean = false;
  cardObject: feedObject = null;
  selectedUrl: SafeUrl = null;
  profiles: object = {};
  selectedProfile: string = "";
  user: User;

  //statistics variables

  NerDisplayedColumns: string[] = ["phrase", "tag", "source"];
  loadingMentions: boolean = true;
  loadingSentiment: boolean = true;
  loadingNer: boolean = true;
  nerGridSource: MatTableDataSource<nerAggr> = new MatTableDataSource<nerAggr>(
    []
  );
  mentionChart: Chart = null;
  sentimentChart: Chart = null;

  @ViewChild("NerMatTable") NerTable: MatTable<nerAggr>;

  constructor(
    private _feedsvc: LiveFeedService,
    private brandReg: BrandRegistrationService,
    private datesvc: DateTimeService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.nerGridSource.data = [...this._feedsvc.nerCount];
    this._setFilterPredicate();
    this.initializeMentionChart();
    this.initializeSentimentChart();
  }

  private _setFilterPredicate(): void {
    this.dataGridSource.filterPredicate = (
      feedItem: feedObject,
      filters: string
    ) => {
      let filter: filterObj = JSON.parse(filters);
      let keywordsBool = true;
      let sourceBool = true;
      if (filter.keywords.length) {
        switch (filter.booleanFuntion) {
          case "AND": {
            if (!filter.keywords.every((val) => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
          case "OR": {
            if (!filter.keywords.some((val) => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
          case "XOR": {
            if (
              filter.keywords.filter((val) => feedItem.text.includes(val))
                .length != 1
            )
              keywordsBool = false;
            break;
          }
          case "NOR": {
            if (filter.keywords.some((val) => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
        }
      }
      if (filter.sources.length && !filter.sources.includes(feedItem.source)) {
        sourceBool = false;
      }
      let sentimentBool = filter.sentiment
        ? filter.sentiment == feedItem.sentiment
        : true;
      return keywordsBool && sourceBool && sentimentBool;
    };
  }
  initialiseLiveFeed() {
    console.log(this.selectedProfile);
    this.socketConn = this._feedsvc.listen(this.selectedProfile).subscribe(
      (res: FeedData) => {
        if (res) {
          res.textFeed.forEach((element) => {
            this.dataGridSource.data.unshift(element);
            this.more = true;
          });
          this.table.renderRows();

          const data = res.aggregate;
          this.updateMentionChart(data["sources"]);
          this.updateSentimentChart(data["sentiment"]);
          if (data["ner"]) {
            this.nerGridSource.data.push(data["ner"]);
            this.NerTable.renderRows();
          }
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
      this.loadingMentions = false;
      this.loadingSentiment = false;
    }
  }
  ngOnDestroy() {
    this.stopFeed();
  }
  showMentionDetails(mention: feedObject) {
    this.cardObject = mention;
    let url = "";
    this.showCard = true;
    if (mention.source === "youtube") {
      url = "https://www.youtube.com/embed/" + mention.id;
      this.selectedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else if (mention.source === "twitter") {
      url = "https://twitter.com/x/status/" + mention.id;
      this.selectedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      (<any>window).twttr.widgets.load(this.tweetContainer.nativeElement);
    }
  }

  initializeMentionChart() {
    console.log("sentiment initialized");
    this.mentionChart = new Chart("mentioncanvas", {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [{}],
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
      type: "radar",
      data: {
        labels: ["positive", "negative", "neutral"],
        datasets: [],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales:{
          xAxes:[{
            ticks:{
              display:false
            }
          }],
          yAxes:[{
            ticks:{
              display:false
            }
      
          }]
        }
        // scales: {
        //   xAxes: [
        //     {
        //       stacked: true,
        //     },
        //   ],
        //   yAxes: [
        //     {
        //       stacked: true,
        //     },
        //   ],
        // },
      },
    });
    if (Object.keys(this._feedsvc.sentimentCount).length) {
      this.updateMentionChart(this._feedsvc.sentimentCount);
    }
  }

  updateSentimentChart(sentiment: Object) {
    console.log("update sentiment", sentiment);
    const l = graphBackgroundColors.length;
    let counter = 0;
    let br = false;
    for (let i in sentiment) {
      if (
        !br &&
        counter < this.sentimentChart.data.datasets.length &&
        i === this.sentimentChart.data.datasets[counter].label
      ) {
        this.sentimentChart.data.datasets[counter].data = sentiment[i];
        console.log("old data");
      } else {
        br = true;
        this.sentimentChart.data.datasets.push({
          data: sentiment[i],
          label: i,
          borderColor: graphBorderColors[counter % l],
          backgroundColor: graphBackgroundColors[counter % l],
        });
      }
      counter++;
    }
    this.sentimentChart.update();
    this.loadingSentiment = false;
  }

  updateMentionChart(mentions: Object) {
    const l = graphBackgroundColors.length;
    let data: any[] = [];
    let colors: string[] = [];
    let counter = 0;
    let labels: string[] = [];
    for (let i in mentions) {
      labels.push(i);
      data.push(mentions[i]);
      colors.push(graphBackgroundColors[counter % l]);
      counter++;
    }
    this.mentionChart.data.labels = labels;
    this.mentionChart.data.datasets[0].data = data;
    this.mentionChart.data.datasets[0].backgroundColor = colors;
    this.mentionChart.update();
    this.loadingMentions = false;
  }

  sentimentCounter(index: number): number {
    return Math.round(
      this._feedsvc.totalCount
        ? (this._feedsvc.sentimentCounter[index] * 100) /
            this._feedsvc.totalCount
        : 0
    );
  }
}
