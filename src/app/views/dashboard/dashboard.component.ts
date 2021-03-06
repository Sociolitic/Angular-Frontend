import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import { filterObj } from "./feed-filter/feed-filter.component";
import { User } from "../../shared/models/user.model";
import { BrandRegistrationService } from "../../shared/services/brand-registration.service";
import { LiveFeedService } from "../../shared/services/live-feed.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  status:boolean=false;
  profiles: object = {};
  selectedProfile: string = "";
  inputProfile:string = "";
  user: User;
  @Output() filterEmitter: EventEmitter<filterObj> =
    new EventEmitter<filterObj>();
  constructor(
    private brandReg: BrandRegistrationService,
    private _feedsvc: LiveFeedService
  ) {}
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user.profiles);
    this.brandReg.findProfiles(this.user.profiles, this.user.bearer).subscribe(
      (res) => {
        this.profiles = res;
        console.log(this.profiles);
        this.selectedProfile = this.user.profiles[0];
        //this.startFeed();
      },
      (err) => console.log("error in fetching profiles", err)
    );
  }
  public isMenuCollapsed: boolean = true;
  
  changeProfile() {
    this._feedsvc.disconnect();
    this._feedsvc.connect();
    this._feedsvc.emit(this.selectedProfile);
    this.inputProfile=this.selectedProfile;
  }
  startFeed() {
    
    if (this.selectedProfile.length) {
      this._feedsvc.disconnect();
      this._feedsvc.connect();
      this._feedsvc.emit(this.selectedProfile);
      this.inputProfile=this.selectedProfile;
    }
  }
  stopFeed() {
    this.inputProfile='';
    this._feedsvc.disconnect();
  }
}
