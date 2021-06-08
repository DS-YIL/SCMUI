import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { NgxSpinnerService } from "ngx-spinner";
import { constants } from 'src/app/Models/MPRConstants'
import { MprService } from 'src/app/services/mpr.service';
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, posearchmodel, PAReportInputModel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-POList',
    templateUrl: './POList.component.html',
})
export class POListComponent implements OnInit {

  constructor(private paService: purchaseauthorizationservice, private router: Router, private spinner: NgxSpinnerService, public constants: constants, public mprservice: MprService, ) { }

    public employee: Employee;
    public approverslist: Array<any>[];
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
  public polistdetails: Array<any>[];
  public posearch: posearchmodel;
  public selectedItem: searchList;
  public reportsearch: PAReportInputModel;
  public dialogTop: string;
  public txtName: string;
  public searchresult: Array<object> = [];
  public searchItems: Array<searchList> = [];
  public dynamicData = new DynamicSearchResult();
  public showList: boolean = false;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }

        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.approverslist = new Array<any>();
      this.polistdetails = new Array<any>();
      this.posearch = new posearchmodel();
      this.loadpolist();
    }

  loadpolist() {
    this.paService.LoadPolist(this.posearch).subscribe(data => {
      this.polistdetails = data;
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
      this.posearch.Vendorid = item.code;
      this.posearch.VendorName = item.name;
    }
    else if (item.listName == "DepartmentId") {
      this.posearch.DepartmentId = item.code;
      this.posearch.DepartmentName = item.name;
    }
    else if (item.listName == "BuyerGroupId") {
      this.posearch.Buyergroupid = item.code;
      this.posearch.BuyerGroup = item.name;
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
