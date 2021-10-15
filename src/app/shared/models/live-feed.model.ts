import { nerAggr } from "../services/live-feed.service";

export interface feedObject {
    id:string;
    source:string;
    text:string;
    sentiment:string;
    created_time: Date;
    misc:any;
    ner:Ner;
    url:String;
    spam: Boolean;
}

export interface Ner{
    CARDINAL: string[];
    DATE: string[];
    EVENT: string[];
    FAC: string[];
    GPE: string[];
    LANGUAGE: string[];
    LAW: string[];
    LOC: string[];
    MONEY: string[];
    NORP: string[];
    ORDINAL: string[];
    ORG: string[];
    PERCENT: string[];
    PERSON: string[];
    PRODUCT: string[];
    QUNATITY: string[];
    TIME: string[];
    WORK_OF_ART: string[];
}

export interface FeedData{
    textFeed: feedObject[];
    aggregate:Aggr;
}
export interface Aggr{
    sources:Object;
    sentiment: Object;
    ner: nerAggr[];
}