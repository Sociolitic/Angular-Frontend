import { Component, Inject, OnInit } from '@angular/core';
import { BrandProfile, User } from '../../../../shared/models/user.model';
import { BrandRegistrationService } from '../../../../shared/services/brand-registration.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireLoginService } from '../../../../shared/services/fire-login.service';
import { DateTimeService } from '../../../../shared/services/date-time.service';
export interface ProfileDialogInterface {
  id:string;
  info:BrandProfile;
}
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  profiles:object={};
  user: User =null;
  constructor(private brandReg: BrandRegistrationService,
    public dialog:MatDialog,
    private datesvc:DateTimeService) { }
  exampleProfs = ['first','second','third','fourth','fifth','sixth'];
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    this.brandReg.findProfiles(this.user.profiles,this.user.bearer).subscribe(
      (res)=>{
        this.profiles=res;
        console.log(this.profiles)
      },
      err => console.log("error in fetching profiles",err)
    )
  }

  openDialog(profileKey:string=null): void {
    const dialogRef = this.dialog.open(ProfileDialog, {
      width:'80vw',
      panelClass: 'custom-dialog-container',
      data: profileKey&&this.profiles.hasOwnProperty(profileKey)?
      {info:this.profiles[profileKey],id:profileKey}:null,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    this.brandReg.findProfiles(this.user.profiles,this.user.bearer).subscribe(
      (res)=>{
        this.profiles=res;
        console.log(this.profiles)
      },
      err => console.log("error in fetching profiles",err)
    )
    });
  }
}

@Component({
  selector: 'create-profile-dialog',
  templateUrl: 'dialog.html',
  styleUrls: ['./dialog.component.scss']
})
export class ProfileDialog {
  brand:string='';
  competitor:string='';

  competitorList:Set<string> =new Set<string>();
  constructor(
    private _brandRegisterSvc: BrandRegistrationService,
    private fireAuth: FireLoginService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileDialogInterface) {
      console.log(data);
      if(data){
        
        this.brand=data.info.brand;
        data.info.competitors.forEach(brand => this.competitorList.add(brand))
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addCompetitor():void{ 
    console.log("called"); 
    if(this.competitor)
      this.competitorList.add(this.competitor.trim());
    this.competitor='';
  }
  removeCompetitor(key:string){
    this.competitorList.delete(key);
  }

  createProfile(){
    if(!this.brand)
    {
      this._snackBar.open('Please enter a brand name',null,{duration: 3000});
    }
    else{
      this._brandRegisterSvc.createProfile(this.brand,[...this.competitorList]).subscribe(
        res=>{
          this._snackBar.open('Profile Created',null,{duration: 3000})
          const user:User = JSON.parse(localStorage.getItem('user'));

          this.fireAuth.fetchDetails(user.bearer).subscribe(
            (res:User) =>{
              let newuser:User = res;
              newuser.bearer=user.bearer;
              localStorage.setItem('user',JSON.stringify(newuser));
            },
            (err) => {
              console.log("HTTP Error in FETCH", err)
              this._snackBar.open('User Authentication failed,Login Again!',null,{duration: 3000});
              this.fireAuth.fireLogout();
            }
          )       
        },
        err => {
          console.log("ERROR CREATING BRand"+err);
          this._snackBar.open('Error',null,{duration: 3000})
        }
      );
    }
  }
}