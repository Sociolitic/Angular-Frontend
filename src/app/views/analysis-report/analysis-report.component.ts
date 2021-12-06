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
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { nerAggr } from "../../shared/services/live-feed.service";
import { nerFilterObj } from "../dashboard/ner-filter/ner-filter.component";
import { MatSort,Sort } from "@angular/material/sort";

@Component({
  selector: "app-analysis-report",
  templateUrl: "./analysis-report.component.html",
  styleUrls: ["./analysis-report.component.scss"],
})
export class AnalysisReportComponent implements OnInit,AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("NerMatTable") NerTable: MatTable<nerAggr>;
  nerGridSource: MatTableDataSource<nerAggr> = new MatTableDataSource<nerAggr>([]);
  NerDisplayedColumns: string[] = ["phrase", "tag", "source","sentiment","count"];
  
  showInfo1:boolean=false;
  showInfo2:boolean=false;
  showInfo3:boolean=false;
  showInfo4:boolean=false;
  showInfo5:boolean=false;
  
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
  sentimentRadarChart: Chart = null;
  sentimentLineChart: Chart = null;
  statisticsData: StatisticsData = null;
  descAnalytics:Object=null;
  textAnalytics:Object=null;
  recommendations:string[]=[];
  nerAggrData:Object=null;

  applyNerFilters(filters: nerFilterObj) {
    if (filters) this.nerGridSource.filter = JSON.stringify(filters);
    //console.dir(filters);
  }
  ngAfterViewInit(){
    //this.nerGridSource.sort = this.sort;

  }
  ngOnInit(): void {
    this._setFilterPredicate();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.brandReg.findProfiles(this.user.profiles, this.user.bearer).subscribe(
      (res) => {
        this.profiles = res;
        this.selectedProfile = this.user.profiles[0];
        this.initializeMentionChart();
        this.initializeSentimentPieChart();
        this.initializeSentimentRadarChart();
        this.initializeSentimentLineChart();
        this.changeProfile();
      },
      (err) => console.log("error in fetching profiles", err)
    );
  }

  private _setFilterPredicate(): void {

    this.nerGridSource.filterPredicate = (
      feedItem: nerAggr,
      filters: string
    ) => {
      let filter: nerFilterObj = JSON.parse(filters);
      let keywordsBool = true;
      let sourceBool = true;
      let tagBool = true;
      if (filter.keywords.length) {
        switch (filter.booleanFuntion) {
          case "AND": {
            if (!filter.keywords.every((val) => feedItem.phrase.includes(val)))
              keywordsBool = false;
            break;
          }
          case "OR": {
            if (!filter.keywords.some((val) => feedItem.phrase.includes(val)))
              keywordsBool = false;
            break;
          }
          case "XOR": {
            if (
              filter.keywords.filter((val) => feedItem.phrase.includes(val))
                .length != 1
            )
              keywordsBool = false;
            break;
          }
          case "NOR": {
            if (filter.keywords.some((val) => feedItem.phrase.includes(val)))
              keywordsBool = false;
            break;
          }
        }
      }
      if (filter.sources.length && !filter.sources.includes(feedItem.source)) {
        sourceBool = false;
      }
      if (filter.tag.length && !filter.tag.includes(feedItem.tag)) {
        tagBool = false;
      }
      let sentimentBool = filter.sentiment.length
        ? filter.sentiment.indexOf(feedItem.sentiment)> -1
        : true;
      return keywordsBool && sourceBool && sentimentBool && tagBool;
    };
  }


  startAggr(){
    //console.log("starting agr")
    this.analyticsSvc.startAggregate(this.selectedProfile);
  }
  mediaArray = [
    { name: "reddit", mentionCompleted: false, sentimentLineCompleted: false },
    { name: "twitter", mentionCompleted: false, sentimentLineCompleted: false },
    { name: "youtube", mentionCompleted: false, sentimentLineCompleted: false },
    { name: "tumblr", mentionCompleted: false, sentimentLineCompleted: false },
  ];
  pieChartSource = "total";
  sentimentLineSource = 'total';
  allComplete: boolean = false;
  period: string = "hours";

  updateAllComplete(media: any) {
    this.allComplete =
      this.mediaArray != null &&
      this.mediaArray.every((t) => t.mentionCompleted);
    this.createMentionChart();
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

  initializeSentimentLineChart() {
    this.sentimentLineChart = new Chart("sentimentlinecanvas", {
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

  initializeSentimentRadarChart() {
    this.sentimentRadarChart = new Chart("radarcanvas", {
      type: "radar",
      data:{
        labels:['positive','negative','neutral'],
        datasets:[],
      },
      options: {
        
        scale:{
          pointLabels:{
            fontSize:16
          },
          ticks:{
            backdropColor:'rgba(0,0,0,0)',
            display:false
          },
          gridLines:{
            color:'rgba(255,255,255,0.3)',
            
          }
        },
        maintainAspectRatio:false,
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

  createSentimentLineChart() {
    let source = this.sentimentLineSource;
    let positiveCount:number[];
    let negativeCount:number[];
    let neutralCount:number[];
    let labellen=this.statisticsData[this.period]['positive'].length;
    if(source==='total'){
      positiveCount=this.statisticsData[this.period]['positive'];
      negativeCount=this.statisticsData[this.period]['negative']
      neutralCount=this.statisticsData[this.period]['neutral']
    }
    else{
      positiveCount = this.statisticsData[this.period]["sources"]
    [source]["positive"]
     negativeCount = this.statisticsData[this.period]["sources"][
      source
    ]["negative"]
    neutralCount = this.statisticsData[this.period]["sources"][
      source
    ]["neutral"]
}
    this.sentimentLineChart.data.labels=this.dataService.labels(this.period,labellen);
    this.sentimentLineChart.data.datasets=[
      {
        label:"positive",
        data:positiveCount,
        backgroundColor:graphBackgroundTransparent[3],
        borderColor:graphBorderColors[3]
      },
      {
        label:"negative",
        data:negativeCount,
        backgroundColor:graphBackgroundTransparent[4],
        borderColor:graphBorderColors[4]

      },
      {
        label:"neutral",
        data:neutralCount,
        backgroundColor:graphBackgroundTransparent[5],
        borderColor:graphBorderColors[5]

      },
    ]
    this.sentimentLineChart.update();
    
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

  createSentimentRadarChart() {
    let l = graphBackgroundTransparent.length;
    let positiveCount=0;
    let negativeCount=0;
    let neutralCount=0;
    let counter=0;
    this.sentimentRadarChart.data.datasets=[];
    for(let source in this.statisticsData[this.period]['sources']){
      positiveCount = this.statisticsData[this.period]["sources"]
    [source]["positive"].reduce((a, b) => a + b, 0);
     negativeCount = this.statisticsData[this.period]["sources"][
      source
    ]["negative"].reduce((a, b) => a + b, 0);
    neutralCount = this.statisticsData[this.period]["sources"][
      source
    ]["neutral"].reduce((a, b) => a + b, 0);
      this.sentimentRadarChart.data.datasets.push(
        {
          label:source,
          data:[positiveCount,negativeCount,neutralCount],
          backgroundColor:graphBackgroundTransparent[counter%l],
          borderColor: graphBorderColors[counter%l]
          
        }
      )
      ++counter;
    }
    
    this.sentimentRadarChart.update();
  }
  fetchGraphData() {
    this.loading = true;
    this.dataService.getChartData(this.selectedProfile).subscribe(
      (statData) => {
        console.log(statData);
        this.statisticsData = {
          tag: statData["tag"],
          mins: this.IsPresent(statData["mins"]) ? statData["mins"] : null,
          hours: this.IsPresent(statData["hours"]) ? statData["hours"] : null,
          days: this.IsPresent(statData["days"]) ? statData["days"] : null,
          months: this.IsPresent(statData["months"]) ? statData["months"] : null,
          years: this.IsPresent(statData["years"]) ? statData["years"] : null,
        };
        //console.log(this.statisticsData);
        
        this.period = 
        this.statisticsData.mins?'mins':
        this.statisticsData.hours?'hours':
        this.statisticsData.days?'days':
        this.statisticsData.months?'months':
        this.statisticsData.years?'years':null;
        this.createGraphs();
        this.loading = false;
      },
      (error) => {
        this.loading=false;
        console.log("error fetching data" + error);
      }
    );
    this.dataService.getNerData(this.selectedProfile).subscribe(
      (res)=>{
        console.log("NER data:");
        console.log(res);
        this.nerAggrData=res;
        this.initializeGrid();
      },
      (err)=>{
        console.log("ERR FETCHING NER",err);
      }
    )
  }
  refreshGraphPeriod(){
    this.createGraphs();
    this.initializeGrid();
  }
  changeProfile() {
    this.fetchGraphData();
    this.fetchAnalytics();
  }
  initializeGrid(){
    console.log("NER GRID called");
    this.nerGridSource.data=[];
    if(this.nerAggrData[this.period]){
    for(let i in this.nerAggrData[this.period]){
      for(let j in this.nerAggrData[this.period][i])
        this.nerGridSource.data.push(this.nerAggrData[this.period][i][j]);
    }}
    //this.nerGridSource.data=res[this.period]?res[this.period][0]:[];
    console.log(this.nerGridSource.data);
    this.NerTable.renderRows();
  }
  fetchAnalytics(){
    //console.log("fetch analytics",this.selectedProfile);
    this.analyticsSvc.descriptiveAnalytics(this.selectedProfile,10).subscribe(
      res => {
        
      console.log(res);
      this.descAnalytics={
        reddit:{
          hotcomment:res['reddit']["hottopicbasedoncommentscount"]['title'],
          hotscore:res['reddit']["hottopicbasedonscore"]['title'],
        },
        tumblr:{
          hashtags:res["tumbulr"]['hashtags']
        },
        youtube:{
          engagingCh:res["youtube"]["ChannelWithMoreDiscussions"],
          categories:res["youtube"]["categoriesOfMentions"],
          hashtags:res['youtube']['hashtags'],
          influencingChannels:res['youtube']['influencingChannels']
        },
        twitter:{
          hashtags:res['twitter']['hashtags'],
          influencers:res['twitter']['influencingUser']['active_users']
        }
      };
      console.log(this.descAnalytics)
      },
      err => console.log(err)
    )

    this.analyticsSvc.textAnalytics(this.selectedProfile,10).subscribe(
      res=> {
        console.log("text analytics working");
        console.log(res);
        this.textAnalytics=res;
      },
      err => console.log(err)
    )
    
    this.analyticsSvc.brandRecommendations(this.selectedProfile).subscribe(
      res=>{console.log("recommendations work",res);
      this.recommendations=res['recommendation'];
      console.log(this.recommendations);
    },
      err=>{console.log(err)}
    )
    this.analyticsSvc.aggregateText(this.selectedProfile).subscribe(
      res=> {
        console.log("NEW ANALYTICS!!!");
        console.log(res);
      }
    )

  }
  IsPresent(obj){
    if(!obj) return false;
    for(let i in obj)
      return true
    return false;
  }

  createGraphs(){
    this.createMentionChart();
    this.createSentimentPieChart();
    this.createSentimentRadarChart();
    this.createSentimentLineChart();
  }
}


