import { Component, OnInit,Directive,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
//import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MprService } from 'src/app/services/mpr.service';
import { ScrapRegisterMasterModel, ScrapItems, ScrapflowModel } from 'src/app/Models/ScrapRegister'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { constants } from 'src/app/Models/MPRConstants'
import { __param } from 'tslib';
import { DecimalPipe } from '@angular/common';
import { Pipe } from '@angular/core';

@Component({
  selector: 'app-Scrapflow',
  templateUrl: './Scrapflow.component.html',
})
  @Pipe({
    name: 'compositeDataKey'
  })
//Name of Class: << ScrapRegisterListComponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 14 - 04 - 2021>>
//        Purpose : << to generate PA, get PA data >>
//            Review Date:<<>> Reviewed By:<<>>
export class ScrapflowComponent implements OnInit { 
  //@Input() newRow: any;
  public scrapmaster: ScrapRegisterMasterModel;
  public scrapflowmodel: ScrapflowModel;
  public scrapflowform: FormGroup;
  public dynamicData = new DynamicSearchResult();
  public dialogTop: string;
  public txtName: string;
  public searchresult: Array<object> = [];
  public searchItems: Array<searchList> = [];
  public showList: boolean = false;
  public selectedItem: searchList;
  public scrapflowsubmittted: boolean;
  public employee: Employee;
  public scraplist: Array<any> = [];

  constructor(public constants: constants, private formBuilder: FormBuilder, public mprservice: MprService, public messageService: MessageService, private router: Router, private paService: purchaseauthorizationservice, private routing: Router, private activeroute: ActivatedRoute) { }
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.scrapflowlist();
    this.scrapmaster = new ScrapRegisterMasterModel();
    this.scraplist = new Array<any>();
    this.scrapflowmodel = new ScrapflowModel();
    this.scrapflowform = this.formBuilder.group({
      Scrapflow: ['', [Validators.required]],
      Inchargename: ['', [Validators.required]]
    })
  }
  public bindSearchListData(e: any,  name?: string, searchTxt?: string, callback?: () => any): void {
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
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
        else
          fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });
    });
  }
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (item.listName == "PreparedBy") {
      this.scrapflowform.controls['Inchargename'].setValue(item.name);
      this.scrapflowform.value['Inchargename'] = item.name;
      this.scrapflowmodel.Inchargename = item.name;
      this.scrapflowmodel.Incharge = item.code;
    }
  }
  InsertScarpflow(data: ScrapflowModel) {
    console.log(data);
    this.scrapflowsubmittted = true;
    if (this.scrapflowform.invalid) {
      return;
    }
    this.scrapflowmodel.createdby = this.employee.EmployeeNo;
    this.paService.InsertScarpflowIncharge(data).subscribe(data => {
      this.scrapflowlist();
    })
  }
  scrapflowlist() {
    this.paService.getscrapflowlist().subscribe(data => {
      this.scraplist = data;
      console.log("this.scraplist", this.scraplist)
    })
  }
  dialogCancel(dialogName) {
    this[dialogName] = false;
  }
}
