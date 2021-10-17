import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { io, Socket } from "socket.io-client";
import { Observable, Subscriber } from "rxjs";
import { FeedData, feedObject, Ner } from "../models/live-feed.model";
import { User } from "../models/user.model";
import { server } from "../constants";
const sentMap = {
  Positive: 0,
  Negative: 1,
  Neutral: 2,
};
export interface nerAggr {
  source: string;
  tag: string;
  phrase: string;
}
const source = "combinedStream";
@Injectable({
  providedIn: "root",
})
export class LiveFeedService {
  public totalCount:number=0;
  public sentimentCounter=[0,0,0];
  backoff: Object={};
  public sourceCount: Object = {};
  public sentimentCount: Object = {};
  nerCount: nerAggr[] = [];
  currentNer:nerAggr[] = [];
  readonly uri = "http://localhost:7000";
  constructor(private _http: HttpClient) {}
  socket: Socket;
  connect() {
    const user: User = JSON.parse(localStorage.getItem("user"));
    this.socket = io(this.uri, {
      autoConnect: false,
      query: { token: user.bearer },
    });
    this.socket.connect();
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.close();
    }
  }
  //for listening: use combinedFeed
  listen(profileId: string) {
    console.log(profileId);
    console.log("listen called");
    return new Observable<FeedData>((subscriber) => {
      this.socket.on("combinedFeed", (data) => {
        //if (!Array.isArray(data)) data = [data];
        console.log("--->> recieved data:",data);
        const stream: feedObject[] = this.formatStream(data);
        console.log("FORMATTED STREAM: ",stream);
        
        subscriber.next({
          textFeed: stream,
          aggregate: {
            sources: this.sourceCount,
            sentiment: this.sentimentCount,
            ner: this.currentNer,
          },
        });
      });
      this.socket.on(source + "End", (data) => {
        if (this.backoff.hasOwnProperty(data)) this.backoff[data] *= 2;
        else this.backoff[data] = 1;
        setTimeout(
          () => this.socket.emit(data + "Combined", profileId),
          this.backoff[data] * 1000
        );
      });
      this.socket.on("error", (err) => console.log("ERROR IN SOCK" + err));
    });
  }

  emit(profileId: string) {
    console.log("listen called");
    this.socket.emit(source, profileId);
  }

  private formatStream(data: Array<any>): feedObject[] {
    this.currentNer=[];
    let feed: feedObject[] = [];
    data.forEach((obj: Object) => {
      let feedItem: feedObject;
      if (
        !obj.hasOwnProperty("id") ||
        !obj.hasOwnProperty("source") ||
        !obj.hasOwnProperty("text") ||
        !obj.hasOwnProperty("sentiment") ||
        !obj.hasOwnProperty("created_time")
      ) {
        console.log("OBJECT does not have specified parameters");
        console.log(obj);
      } else {
        this.totalCount+=1;
        this.sentimentCounter[sentMap[obj['sentiment']]]+=1
        this.backoff[obj["source"]] = 1;
        feedItem = {
          id: obj["id"],
          source: obj["source"],
          text: obj["text"],
          sentiment: obj["sentiment"],
          created_time: new Date(obj["created_time"]),
          misc: obj["misc"] ? obj["misc"] : null,
          ner: obj["ner"],
          url: obj['url'],
          spam: obj['spam']
        };
        feed.push(feedItem);
        this.updateAggregate(feedItem);
      }
    });
    return feed;
  }
  updateAggregate(feedItem: feedObject) {
    if (this.sourceCount.hasOwnProperty(feedItem.source)) {
      this.sourceCount[feedItem.source] += 1;
    } else this.sourceCount[feedItem.source] = 1;
    //this.updateSentiment('combined',feedItem.sentiment);
    this.updateSentiment(feedItem.source, feedItem.sentiment);
    this.updateNer(feedItem.source, feedItem.ner);
  }

  updateSentiment(source: string, sentiment: string) {
    if (this.sentimentCount.hasOwnProperty(source))
      this.sentimentCount[source][sentMap[sentiment]] += 1;
    else this.sentimentCount[source] = [0, 0, 0];
  }
  updateNer(source: string, ner: Ner) {
    
    for (let i in ner)
      ner[i].forEach((element) => {
        const aggr:nerAggr={
          source: source,
          tag: i,
          phrase: element,
        };
        this.currentNer.push(aggr)
        this.nerCount.push(aggr);
      });
  }

}
