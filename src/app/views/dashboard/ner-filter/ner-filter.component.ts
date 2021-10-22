import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
export interface nerFilterObj{
  keywords: string[];
  sources:string[];
  sentiment:string[];
  booleanFuntion:string;
  tag:string;
}
@Component({
  selector: 'app-ner-filter',
  templateUrl: './ner-filter.component.html',
  styleUrls: ['./ner-filter.component.scss']
})
export class NerFilterComponent implements OnInit {
  sourceList:string[]=['youtube','twitter','reddit','tumblr'];
  tagList:string[]=["CARDINAL",
  "DATE",
  "EVENT",
  "FAC",
  "GPE",
  "LANGUAGE",
  "LAW",
  "LOC",
  "MONEY",
  "NORP",
  "ORDINAL",
  "ORG",
  "PERCENT",
  "PERSON",
  "PRODUCT",
  "QUNATITY",
  "TIME",
  "WORK_OF_ART",]
  sentiment:string[]=[];
  keywords= new Set<string>();
  filterGroup:FormGroup= new FormGroup({
    keywordControl: new FormControl(''),
    sourceControl: new FormControl(),
    booleanControl: new FormControl('OR'),
    tagControl: new FormControl()
  });
  @Output() filterEmitter: EventEmitter<nerFilterObj> = new EventEmitter<nerFilterObj>();
  
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
    
      let appliedFilters: nerFilterObj = {
        keywords: Array.from(this.keywords),
        sources: this.filterGroup.get('sourceControl').value?
          this.filterGroup.get('sourceControl').value:[],
        booleanFuntion: this.filterGroup.get('booleanControl').value,
        sentiment: this.sentiment,
        tag: this.filterGroup.get('tagControl').value?
        this.filterGroup.get('tagControl').value:[],
      }
      console.dir(appliedFilters);
      this.filterEmitter.emit(appliedFilters);
  }

  sentimentChange(event:MatButtonToggleChange){
    this.sentiment=event.value;
  }
}
