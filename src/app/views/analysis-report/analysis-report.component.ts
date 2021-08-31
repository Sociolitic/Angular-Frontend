import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartDataService } from '../../shared/services/chart-data.service';
import { StatisticsData } from '../../shared/models/graphs.model';
import { LineChartData } from '../../shared/models/graphs.model';
import { graphBorderColors,graphBackgroundColors } from '../../shared/constants';
@Component({
  selector: 'app-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {
  constructor(private dataService: ChartDataService) { 
    for(let i=1;i<=24;i++)
      this.hourlyLabels.push("hour "+i);
  }
  hourlyLabels:string[]=[];
  mentionChart:Chart=null;
  sentimentPieChart:Chart=null;
  sentimentBarChart:Chart=null;
  statisticsData:StatisticsData=null;
  ngOnInit(): void {
    this.initializeMentionChart();
    this.initializeSentimentPieChart();
    this.fetchGraphData();
  }

  mediaArray = [
    {name: "reddit", mentionCompleted: false, sentimentPieCompleted:false},
    // {name: "insta", mentionCompleted: false, sentimentPieCompleted:false},
    {name: "twitter", mentionCompleted: false, sentimentPieCompleted:false},
    {name: "youtube", mentionCompleted: false, sentimentPieCompleted:false},
    {name: "tumblr", mentionCompleted:false, sentimentPieCompleted:false}
  ]
  pieChartSource='total';
  allComplete: boolean = false;
  period: string = "hourly";

  updateAllComplete(media:any) {
    this.allComplete = this.mediaArray != null && this.mediaArray.every(t => t.mentionCompleted);
    this.createMentionChart();
  }

  someComplete(): boolean {
    if (this.mediaArray == null) {
      return false;
    }
    return this.mediaArray.filter(t => t.mentionCompleted).length > 0 && !this.allComplete;
  }

  setAll(mentionCompleted: boolean) {
    this.allComplete = mentionCompleted;
    if (this.mediaArray == null) {
      return;
    }
    this.mediaArray.forEach(t => t.mentionCompleted = mentionCompleted);
    this.createMentionChart();
  }
  
  initializeMentionChart(){
    this.mentionChart = new Chart('canvas',{
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    })
  }
  initializeSentimentPieChart(){
    this.sentimentPieChart = new Chart('piecanvas',{
      type: 'pie',
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    })
    
  }
  createMentionChart(){
    let lineDataset=[];
    let counter=0;
    this.mediaArray.forEach(source =>{
      if(source.mentionCompleted){
        let lineData:number[]=this.statisticsData.all_mentions[source.name][this.period];
        lineDataset.push({
          data:lineData,
          label:source.name,
          borderColor:graphBorderColors[counter],
          backgroundColor:graphBackgroundColors[counter]
        })
        counter++;
      }
    })
    if(lineDataset.length===0)
    {      
      lineDataset.push(
        {
          data:this.statisticsData.all_mentions.total[this.period],
          label: "Aggregate",
          borderColor: graphBorderColors[0],
          backgroundColor: graphBackgroundColors[0]
        }); 
    }
    if(this.mentionChart){
      this.mentionChart.data={
        labels: this.hourlyLabels,
        datasets: lineDataset
      }
      this.mentionChart.update();
    }
  }
  createSentimentPieChart(){
    let source=this.pieChartSource;
    const postiveCount:number=this.statisticsData.
        positive_mentions[source][this.period].reduce((a,b)=>a+b,0);
        const negativeCount:number=this.statisticsData.
        negative_mentions[source][this.period].reduce((a,b)=>a+b,0);
        const neutralCount:number=this.statisticsData.
        neutral_mentions[source][this.period].reduce((a,b)=>a+b,0);
        const pieData:LineChartData[] = [{
          data: [postiveCount,negativeCount,neutralCount],
          backgroundColor:["#75bfac","#777","#AB4925"] 
        }]
    if(this.sentimentPieChart){
      this.sentimentPieChart.data={
        labels: ['positive','negative','neutral'],
        datasets: pieData
      }
      this.sentimentPieChart.update();
    }
  }
  fetchGraphData(){
    this.dataService.getDailyData().subscribe(
      (statData:StatisticsData)=> {
        this.statisticsData=statData;
        
        this.createMentionChart();
        this.createSentimentPieChart();
      },
      error => {
        console.log('error fetching data'+error);
      }
    );
  }
  refreshGraphPeriod(){
    // this.period=period;
    this.createSentimentPieChart();
    this.createMentionChart();
  }
}
