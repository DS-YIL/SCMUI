import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee, DynamicSearchResult } from '../../Models/mpr';
import {  FormBuilder } from '@angular/forms'
import { constants } from 'src/app/Models/MPRConstants';
import 'rxjs/add/observable/of';
import { MessageService } from 'primeng/api';
import { TokuchuRequest, tokuchufilters } from 'src/app/Models/PurchaseAuthorization'
import { MprService } from 'src/app/services/mpr.service';

@Component({
  selector: 'app-tokuchReq',
  templateUrl: './TokuchuReqList.component.html',
})

export class TokuchuReqListComponent implements OnInit {
  constructor(private paService: purchaseauthorizationservice, public MprService: MprService, public constants: constants, private router: Router, public messageService: MessageService, public formbuilder: FormBuilder) { }

  public employee: Employee;
  public tokuchufilters: tokuchufilters;
  public tokuchuReqList: Array<TokuchuRequest> = [];
  public verifyEmpList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();

  ngOnInit() {
    this.tokuchufilters = new tokuchufilters();
    this.tokuchufilters.PreparedBY = "";
    this.tokuchufilters.VerifiedBy = "";
    this.tokuchufilters.PreverifiedBy = "";
    this.tokuchuReqList = [];
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
      this.tokuchufilters.VerifiedBy = this.employee.EmployeeNo
      console.log(" this.tokuchufilters", this.tokuchufilters)
    }
    else {
      this.router.navigateByUrl("Login");
    }
    //if (localStorage.getItem("tokuchuDetails")) {
    //  this.reportinput = JSON.parse(localStorage.getItem("statusDetails"));
    //  this.GetMprRequisitionreport(this.reportinput);
    //  localStorage.removeItem("statusDetails");
    //  this.reportinput.DepartmentId = this.reportinput.DepartmentId;
    //}
    //this.tokuchufilters = new tokuchufilters();
    //this.tokuchufilters.PreparedBY = "";
    //this.tokuchufilters.VerifiedBy = "";
    this.tokuchuReqList = [];
    this.getEmplist();
    this.getTokuchuReqList();
  }


  getEmplist() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select EmployeeNo,Name from employee where  DOL is null and OrgDepartmentId=14";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.verifyEmpList = data;
    })
  }

  getTokuchuReqList() {
    this.paService.getTokuchuReqList(this.tokuchufilters).subscribe(data => {
      this.tokuchuReqList = data;
      });
  }

  goTokuchuRequest(details: any) {
    this.router.navigate(["/SCM/TokochuRequest", details.TokuchRequestid]);
  }
}
