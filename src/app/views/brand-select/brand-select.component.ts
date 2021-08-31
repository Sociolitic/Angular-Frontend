import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import { User } from '../../shared/models/user.model';
import { BrandRegistrationService } from '../../shared/services/brand-registration.service';
@Component({
  selector: 'app-brand-select',
  templateUrl: './brand-select.component.html',
  styleUrls: ['./brand-select.component.scss']
})
export class BrandSelectComponent implements OnInit {
  competitorList:Set<string> =new Set<string>();
  brandSelectFormGroup: FormGroup;
  competitorSelectFormGroup: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  user:User;
  constructor(private _formBuilder: FormBuilder,
    private _BrandRegisterSvc: BrandRegistrationService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    localStorage.getItem('user')
    this.brandSelectFormGroup= this._formBuilder.group(
      {brandControl:['',Validators.required]}
      )
    // this.competitorSelectFormGroup = this._formBuilder.group(
    //   { competitorControl:['']}
    // )
  }
  addCompetitor(event:MatChipInputEvent):void{
    console.log("called adder");
    const competitor = (event.value || '').trim();
    if(competitor)
      this.competitorList.add(competitor);
  }
  removeCompetitor(key:string){
    this.competitorList.delete(key);
  }
  submitForm(){
    console.log("Submitting form");
    const brand=this.brandSelectFormGroup.get('brandControl').value;
    this._BrandRegisterSvc.registerBrand(brand,[...this.competitorList]);
  }

}
