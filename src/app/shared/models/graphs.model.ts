export interface LineChartData {
    label?: string;
    data: number[];
    borderColor?: any;
    backgroundColor?: any;
}
export interface StatisticsData {
    tag: string;
    all_mentions: ApiSourceData;
    positive_mentions: ApiSourceData;
    negative_mentions: ApiSourceData;
    neutral_mentions: ApiSourceData;  
  }

export interface ApiSourceData{
    total: TimeSeriesData;
    twitter?: TimeSeriesData;
    youtube?: TimeSeriesData;
    insta?: TimeSeriesData;
    reddit?: TimeSeriesData;
    tumblr?: TimeSeriesData;
}  
export interface TimeSeriesData{
    hourly: number[];
    daily: number[];
    monthly: number[];
    yearly: number[];   
}
