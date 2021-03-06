import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

export interface filterObj{
  keywords: string[];
  sources:string[];
  booleanFuntion:string;
  sentiment:string[];
}
@Component({
  selector: 'app-feed-filter',
  templateUrl: './feed-filter.component.html',
  styleUrls: ['./feed-filter.component.scss']
})
export class FeedFilterComponent implements OnInit {
  sourceList:string[]=['youtube','twitter','reddit','tumblr'];
  keywords= new Set<string>();
  filterGroup:FormGroup= new FormGroup({
    keywordControl: new FormControl(''),
    sourceControl: new FormControl(),
    booleanControl: new FormControl('OR'),
  });
  @Output() filterEmitter: EventEmitter<filterObj> = new EventEmitter<filterObj>();
  sentiment:string[]=[];
  ngOnInit(): void {
  }
  constructor(){}
  
  addKeyword(){
    if(this.filterGroup.get('keywordControl').value)
      this.keywords.add(this.filterGroup.get('keywordControl').value);
  }

  removeKey(key:string){
    this.keywords.delete(key);
  }

  clearFilters(){
    this.filterGroup.reset();
    this.keywords.clear();
  }

  applyFilters(){
    
      let appliedFilters: filterObj = {
        keywords: Array.from(this.keywords),
        sources: this.filterGroup.get('sourceControl').value?
          this.filterGroup.get('sourceControl').value:[],
        booleanFuntion: this.filterGroup.get('booleanControl').value,
        sentiment: this.sentiment
      }
      console.dir(appliedFilters);
      this.filterEmitter.emit(appliedFilters);
  }

  sentimentChange(event:MatButtonToggleChange){
    this.sentiment=event.value;
  }
}
