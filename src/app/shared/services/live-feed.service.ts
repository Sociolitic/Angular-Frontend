import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import {io, Socket} from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { feedObject } from '../models/live-feed.model';
import { User } from '../models/user.model';
import { T } from '@angular/cdk/keycodes';
@Injectable({
  providedIn: 'root'
})
export class LiveFeedService {
  readonly uri ="http://13.234.201.120:7000";
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
    return new Observable<feedObject[]>((subscriber)=>{
      this.socket.on("combinedFeed",(data)=>{
        if(!Array.isArray(data))
          data=[data];
        const stream:feedObject[]=this.formatStream(data)
        subscriber.next(stream)
      })
      this.socket.on('combinedFeedEnd',(data)=>{
        this.socket.emit("combinedStream",profileId);
      
      this.socket.on("error",(err)=>
      console.log("ERROR IN SOCK"+err))
    })
    })
  }


  emit(profileId:string){
    console.log("listen called");
    this.socket.emit('refresh',true);
    this.socket.emit("combinedStream",profileId);
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
        console.log("OBJECT does not have specified parammeters");
        console.log(obj)
      }
      else{
        feedItem={
          id:obj['id'],
          source:obj['source'],
          text:obj['text'],
          sentiment:obj['sentiment'],
          created_time: obj['created_time'],
          misc:obj['misc']?obj['misc']:null
        }
        feed.push(feedItem); 
      }
    })
    return feed;
  }
  
}
