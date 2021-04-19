import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import { MessageService } from 'primeng/api';
import { constants } from 'src/app/Models/MPRConstants';
import { Employee, BankGuarantee, BGStatusTrack, DynamicSearchResult } from 'src/app/Models/mpr';

@Component({
  selector: 'app-bg-view',
  templateUrl: './BGView.component.html'
})
export class BGViewComponent implements OnInit {

  public employee: Employee;
  // public asnItem: any;
  public BGItem: BankGuarantee;
  public bgid: number = 0;
  public BGStatus: BGStatusTrack;
  public dynamicData: DynamicSearchResult;
  public BGStatusTrackList: Array<any> = [];
  public displayFooter: boolean = false;

  constructor(public MprService: MprService, private router: Router, private route: ActivatedRoute, public constants: constants, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else {
      this.router.navigateByUrl("Login");
      return true;
    }
    this.BGItem = new BankGuarantee();
    this.BGStatus = new BGStatusTrack()
    this.route.params.subscribe(params => {
      this.bgid = params["BGId"];
      this.getBGDetails();
    });

  }

  //get BG Details
  getBGDetails() {
    this.spinner.show();
    this.MprService.getBGDetails(this.bgid).subscribe(data => {
      this.spinner.hide();
      this.BGItem = data;
      if ((this.BGItem.BGStatus == "Submitted" || this.BGItem.BGStatus == "Sent for Modification" || this.BGItem.BGStatus == "Rejected") && this.BGItem.BuyerManger == this.employee.EmployeeNo)
        this.displayFooter = true;
      else
        this.displayFooter = false;
      this.getBGTrackDetails();
    })
  }
  //get BG Status track details
  getBGTrackDetails() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from BGStatusTrackDetails where BGId=" + this.BGItem.BGId + " order by StatustrackId ";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide();
      this.BGStatusTrackList = data;
    });
  }

  BGStatusUpdate() {
    this.spinner.show();
    this.BGStatus.UpdatedBy = this.employee.EmployeeNo;
    this.BGStatus.BGId = this.BGItem.BGId;
    this.MprService.updateBGStatus(this.BGStatus).subscribe(data => {
      this.spinner.hide();
      this.BGItem = data;
      if ((this.BGItem.BGStatus == "Submitted" || this.BGItem.BGStatus == "Sent for Modification" || this.BGItem.BGStatus == "Rejected") && this.BGItem.BuyerManger == this.employee.EmployeeNo)
        this.displayFooter = true;
      else
        this.displayFooter = false;

      this.getBGTrackDetails();
    })
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }
}
