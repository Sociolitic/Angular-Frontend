import { ChangeDetectorRef, Component, OnInit,ViewChild,OnDestroy, Input } from '@angular/core';
import { filterObj } from '../feed-filter/feed-filter.component';
import { MatTable,MatTableDataSource } from '@angular/material/table';
import { LiveFeedService } from '../../../shared/services/live-feed.service';
import { Observable,Subscription,interval } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';
import { FeedData, feedObject } from '../../../shared/models/live-feed.model';
import { BrandRegistrationService } from '../../../shared/services/brand-registration.service';
import { mediaImages } from '../../../shared/constants';
import { DateTimeService } from '../../../shared/services/date-time.service';
export interface feedSource {
  source_name: string;
  source_observable: Observable<feedObject[]>;
  source_sub: Subscription;
}
@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit,OnDestroy {
  logos = mediaImages;
  @ViewChild(MatTable) table:MatTable<feedObject>;
  @Input()set changeProfile(profile:string){
    console.log(profile);
    if(profile.length)
    {
    this.selectedProfile=profile;
    this.dataGridSource.data=[];
    this.startFeed();
  }
  }
  @Input()set applyFilters(filters:filterObj){
    this.dataGridSource.filter=JSON.stringify(filters);
    console.dir(filters);
  }
  tableData:feedObject[]=[];
  more:boolean=false;
  dataGridSource:MatTableDataSource<feedObject> = new MatTableDataSource<feedObject>([]);
  displayedColumns=['source','text'];
  feedDataSources:{}={};
  socketConn:Subscription;
  showCard:boolean=false;
  cardObject:feedObject=null;
  profiles:object={};
  selectedProfile:string="";
  user:User;
  constructor(private _feedsvc:LiveFeedService,
    private brandReg: BrandRegistrationService,
    private datesvc: DateTimeService) { }
  ngOnInit(): void {
    this._setFilterPredicate();
  }
  
  private _setFilterPredicate():void {
    this.dataGridSource.filterPredicate = (feedItem:feedObject,filters:string) =>{
      let filter:filterObj = JSON.parse(filters);
      let keywordsBool= true;
      let sourceBool =true;
      if(filter.keywords.length){
        switch(filter.booleanFuntion){
          case "AND":{
            if(!filter.keywords.every(val => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
          case "OR":{
            if(!filter.keywords.some(val => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
          case "XOR":{
            if(filter.keywords.filter(val => feedItem.text.includes(val)).length!=1)
              keywordsBool = false;
            break; 
          }
          case "NOR":{
            if(filter.keywords.some(val => feedItem.text.includes(val)))
              keywordsBool = false;
            break;
          }
        }
      }
      if(filter.sources.length && !filter.sources.includes(feedItem.source)){
        sourceBool=false;
      }
      let sentimentBool = filter.sentiment?filter.sentiment==feedItem.sentiment:true;
      return keywordsBool&&sourceBool&&sentimentBool;
    }
  }
  initialiseLiveFeed(){
    this.socketConn=this._feedsvc.listen(this.selectedProfile).subscribe(
            (res:FeedData) =>{
              if(res)
              {
              res.textFeed.forEach(element => {
                this.dataGridSource.data.unshift(element);
                this.more=true;
              });
              this.table.renderRows();}
            },
            error =>{
              console.log('STREAM ERROR',error);
            }
          )
  }

  @Input() set setStatus(status:boolean){
    if(status)
      this.startFeed();
    else
      this.stopFeed();
  }
  startFeed(){
    this.stopFeed();
    this.initialiseLiveFeed();
  }
  stopFeed(){
    if(this.socketConn){
      this.socketConn.unsubscribe();
      this.socketConn=null;
    }
  }
  ngOnDestroy(){
    this.stopFeed();
  }
  showMentionDetails(mention:feedObject){
    this.cardObject=mention;
    this.showCard=true;
  }
  
}
