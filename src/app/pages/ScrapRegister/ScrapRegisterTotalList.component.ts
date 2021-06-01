import { Component, OnInit,Directive,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
//import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MprService } from 'src/app/services/mpr.service';
import { ScrapRegisterMasterModel, ScrapItems, scrapsearchmodel } from 'src/app/Models/ScrapRegister'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { constants } from 'src/app/Models/MPRConstants'
import { __param } from 'tslib';
import { DecimalPipe } from '@angular/common';
import { Pipe } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-ScrapRegisterTotalList',
  templateUrl: './ScrapRegisterTotalList.component.html',
})
  @Pipe({
    name: 'compositeDataKey'
  })
//Name of Class: << ScrapRegisterListComponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 14 - 04 - 2021>>
//        Purpose : << to generate PA, get PA data >>
//            Review Date:<<>> Reviewed By:<<>>

export class ScrapRegisterTotalListComponent implements OnInit {
  //@Input() newRow: any;
  public scrapmaster: ScrapRegisterMasterModel;
  public scrapitems: ScrapItems;
  public scrappageform: FormGroup;
  public dynamicData = new DynamicSearchResult();
  public dialogTop: string;
  public txtName: string;
  public searchresult: Array<object> = [];
  public searchItems: Array<searchList> = [];
  public showList: boolean = false;
  public Departmentsubmittted: boolean;
  public employee: Employee;
  public scraplist: Array<any> = [];
  public scrapflow: Array<any> = [];
  public scrapsearch: scrapsearchmodel;
  public scrapflowlist: Array<any> = [];
  public selectedItem: searchList;
  constructor(public constants: constants, private formBuilder: FormBuilder, public mprservice: MprService, public messageService: MessageService, private router: Router, private paService: purchaseauthorizationservice, private routing: Router, private activeroute: ActivatedRoute) { }
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
      //this.scrapsearch.employeeno= this.employee.EmployeeNo;
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.scrapmaster = new ScrapRegisterMasterModel();
    this.scrapsearch = new scrapsearchmodel();
    this.scraplist = new Array<any>();
    this.scrapflow = new Array<any>();
    this.scrapflowlist = new Array<any>();
    //this.getscrapflow();
    this.getscraplist(this.scrapsearch);
  }
  getscraplist(data: scrapsearchmodel) {
    this.paService.getscraplist(data).subscribe(data => {
      this.scraplist = data;
      console.log("scrap", this.scraplist)
    })
  }
  getscrapflow() {
    this.scrapsearch.employeeno = this.employee.EmployeeNo;
    this.paService.Getincharepermissionlist(this.scrapsearch).subscribe(data => {
      this.scrapflow = data;
      this.scrapsearch.scrapflow = [];
      this.scrapflow.forEach((items) => {
        this.scrapsearch.scrapflow.push(items.Scrapflow)
      })
      this.submit(this.scrapsearch)
      console.log("xxxx", this.scrapsearch)
    })
  }
  submit(input: scrapsearchmodel) {
    this.paService.getscraplist(input).subscribe(data => {
      //this.scrapflow = [];
      this.scraplist = data
      console.log("this", this.scrapflow)
    })
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    this.mprservice.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {

        if (name == "venderid")
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
        //else if
        //    fName = item[this.constants[name].fieldname] + " - " + item[""]
        else
          fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });
      //if (this.selectedItem.name == null) {
      //    var list = this.selectedlist.filter(li => li.listName == name);
      //    if (list.length > 0)
      //        this.selectedItem = this.searchItems.filter(li => li.code == list[0].code)[0];
      //}
      //if (this.mprRevisionModel[name] != null)
      //    this.selectedItem = this.searchItems.filter(li => li.code == this.mprRevisionModel[name])[0];
      //if (callback)
      //    callback();
    });
  }
  dialogCancel(dialogName) {
    this[dialogName] = false;
  }
  onsrchTxtChange(modelparm: string, model: string) {
    //if (value == "") {
    this[model][modelparm] = "";
    //}
  }
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    if (item.listName == "venderid") {
      this.scrapsearch.Vendorid = item.code;
      this.scrapsearch.VendorName = item.name;
    }
    else if (item.listName == "DepartmentId") {
      this.scrapsearch.DepartmentId = item.code;
      this.scrapsearch.DepartmentName = item.name;
    }
    else {

    }

    //else {
    //  this.buyergroups.BuyerGroupId = item.code;
    //  this.buyergroups.BuyerGroup = item.name;
    //  this.padetails.BuyerGroupId = item.code;
    //}
  }
}
