export interface LineChartData {
    label?: string;
    data: number[];
    borderColor?: any;
    backgroundColor?: any;
}
export interface StatisticsData {
    tag: string;
    years: ApiSourceData;
    months: ApiSourceData;
    days: ApiSourceData;  
    hours: ApiSourceData;
    mins: ApiSourceData;
  }

export interface ApiSourceData{
    total: Number[];
    positive: Number[];
    negative: Number[];
    neutral: Number[]; 
    sources:Object;
}  
export interface TimeSeriesData{
    total: Number[];
    positive: Number[];
    negative: Number[];
    neutral: Number[];   
}
