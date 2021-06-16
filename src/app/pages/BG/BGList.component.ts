import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { NgxSpinnerService } from 'ngx-spinner'
import { constants } from 'src/app/Models/MPRConstants';
import { BGfilters, Employee} from 'src/app/Models/mpr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bg-list',
  templateUrl: './BGList.component.html'
})
export class BGListComponent implements OnInit {

  constructor(public MprService: MprService, private router: Router, private datePipe: DatePipe, private spinner: NgxSpinnerService, public constants: constants) { }
  public employee: Employee;
  public BGList: Array<any> = [];
  public BGfilters: BGfilters;
  public BGOpenCnt: number = 0;
  public BGSubmittedCnt: number = 0;
  public BGVerifiedCnt: number = 0;
  public BGSfmCnt: number = 0;
  public BGRejCnt: number = 0;
  public BGExpCnt: number = 0;
  public BGClsCnt: number = 0;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else {
      this.router.navigateByUrl("Login");
      return true;
    }
    this.BGfilters = new BGfilters();
    this.BGfilters.FromDate = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd");
    this.BGfilters.ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    this.bgList();
  }

  bgList() {
    this.spinner.show();
    this.MprService.getBGList(this.BGfilters).subscribe(data => {
      this.spinner.hide();
      this.BGList = data;
      this.BGOpenCnt = this.BGList.filter(li => li.BGStatus == "Open").length;
      this.BGSubmittedCnt = this.BGList.filter(li => li.BGStatus == "Submitted").length;
      this.BGVerifiedCnt = this.BGList.filter(li => li.BGStatus == "Verified").length;
      this.BGSfmCnt = this.BGList.filter(li => li.BGStatus == "Sent for Modification").length;//sent for modification
      this.BGRejCnt = this.BGList.filter(li => li.BGStatus == "Rejected").length;
      this.BGExpCnt = this.BGList.filter(li => li.BGStatus == "Expired").length;
      this.BGClsCnt = this.BGList.filter(li => li.BGStatus == "Closed").length;
    })
  }
}
