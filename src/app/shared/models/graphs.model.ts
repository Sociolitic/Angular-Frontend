export interface LineChartData {
    label?: string;
    data: number[];
    borderColor?: any;
    backgroundColor?: any;
}
export interface StatisticsData {
    tag: string;
    years: ApiSourceData[];
    months: ApiSourceData[];
    days: ApiSourceData[];  
    hours: ApiSourceData[];
    mins: ApiSourceData[];
  }

export interface ApiSourceData{
    start: Date;
    end: Date;
    total: Number;
    positive: Number;
    negative: Number;
    neutral: Number;
    sources:Object;
}  
export interface TimeSeriesData{
    hourly: number[];
    daily: number[];
    monthly: number[];
    yearly: number[];   
}
