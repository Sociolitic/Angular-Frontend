import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { FeedData, feedObject, Ner } from '../models/live-feed.model';
import { User } from '../models/user.model';
import { server } from '../constants';
const sentMap={
  "Positive":0,
  "Negative":1,
  "Neutral":2
}
export interface nerAggr{
  source:string;
  tag:string;
  phrase:string;
}
const source="twitter";
@Injectable({
  providedIn: 'root'
})
export class LiveFeedService {
  sourceCount:Object={};
  sentimentCount:Object={
  };
  nerCount:nerAggr[]=[];
  readonly uri ='http://localhost:7000';
  constructor(private _http: HttpClient) {
    
  }
  socket:Socket;
  connect(){
    const user: User= JSON.parse(localStorage.getItem('user')); 
    this.socket = io(this.uri,{
      autoConnect: false,
      query: { token: user.bearer }
    });
    this.socket.connect();
  }
  disconnect(){
    if(this.socket){
    this.socket.disconnect();
    this.socket.close();
  }
  }
  listen(profileId:string){
    console.log(profileId);
    console.log("listen called");
    return new Observable<FeedData>((subscriber)=>{
      this.socket.on("twitterFeed",(data)=>{
        if(!Array.isArray(data))
          data=[data];
        const stream:feedObject[]=this.formatStream(data)
        console.log(data);
        subscriber.next({
          textFeed:stream,
          aggregate:{
            sources:this.sourceCount,
            sentiment:this.sentimentCount,
            ner:this.nerCount.length?this.nerCount[this.nerCount.length-1]:null
          }
        })
      })
      this.socket.on(source+'FeedEnd',(data)=>{
        this.socket.emit(source+'Combined',profileId);
      
      this.socket.on("error",(err)=>
      console.log("ERROR IN SOCK"+err))
    })
    })
  }


  emit(profileId:string){
    console.log("listen called");
    this.socket.emit(source,profileId);
  }


  private formatStream(data:Array<any>):feedObject[]{
    let feed:feedObject[]= [];
    data.forEach((obj:Object) =>{
      let feedItem:feedObject;
      if(!obj.hasOwnProperty('id') || !obj.hasOwnProperty('source') ||
      !obj.hasOwnProperty('text') ||
      !obj.hasOwnProperty('sentiment') ||
      !obj.hasOwnProperty('created_time')
      ){
        console.log("OBJECT does not have specified parameters");
        console.log(obj)
      }
      else{
        feedItem={
          id:obj['id'],
          source:obj['source'],
          text:obj['source']==='tumblr'?obj['misc']['body']:obj['text'],
          sentiment:obj['sentiment'],
          created_time: new Date(obj['created_time']),
          misc:obj['misc']?obj['misc']:null,
          ner:obj['ner']
        }
        feed.push(feedItem);
        this.updateAggregate(feedItem);

      }
    })
    return feed;
  }
  updateAggregate(feedItem:feedObject){
    if(this.sourceCount.hasOwnProperty(feedItem.source)){
      this.sourceCount[feedItem.source]+=1;
    }
    else
      this.sourceCount[feedItem.source]=1;
    //this.updateSentiment('combined',feedItem.sentiment);
    this.updateSentiment(feedItem.source,feedItem.sentiment);
    this.updateNer(feedItem.source,feedItem.ner);
  }

  updateSentiment(source:string,sentiment:string){
    if(this.sentimentCount.hasOwnProperty(source))
      this.sentimentCount[source][sentMap[sentiment]]+=1
    else
      this.sentimentCount[source]=[0,0,0];
  }
  updateNer(source:string,ner:Ner){
    for( let i in ner)
      ner[i].forEach(element => {
        this.nerCount.push({
          source:source,
          tag:i,
          phrase:ner[i]
        })
      });
      
  }
}
