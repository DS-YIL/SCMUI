import { Component, OnInit,Directive,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
//import { Employee, MPRVendorDetail, MPRBuyerGroup } from '../../Models/mpr';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { MprService } from 'src/app/services/mpr.service';
import { ScrapRegisterMasterModel, ScrapItems } from 'src/app/Models/ScrapRegister'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn, MinLengthValidator } from '@angular/forms';
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { constants } from 'src/app/Models/MPRConstants'
import { __param } from 'tslib';
import { DecimalPipe } from '@angular/common';
import { Pipe } from '@angular/core';

@Component({
  selector: 'app-ScrapRegister',
  templateUrl: './ScrapRegister.component.html',
})
  @Pipe({
    name: 'compositeDataKey'
  })
//Name of Class: << purchasePaymentComponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 14 - 04 - 2021>>
//        Purpose : << to generate PA, get PA data >>
//            Review Date:<<>> Reviewed By:<<>>
export class ScrapRegisterComponent implements OnInit {
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
  clonedProducts: { [s: string]: ScrapItems; } = {};

  constructor(public constants: constants, private formBuilder: FormBuilder, public mprservice: MprService, private paService: purchaseauthorizationservice, private routing: Router, private activeroute: ActivatedRoute) { }
  ngOnInit() {
    this.scrapmaster = new ScrapRegisterMasterModel();
    this.scrappageform = this.formBuilder.group({
      TruckNo: ['', [Validators.required]],
      DateOfEntry: ['', [Validators.required]],
      DepartmentName: ['', [Validators.required]],
      RequestedBY: ['', [Validators.required,]],
      PreparedBY: ['', [Validators.required]],
      ItemId: ['', [Validators.required]],
      UOM: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      Qty: ['', [Validators.required]],
      UnitPrice: ['Validators.required'],
      tcs: ['', [Validators.required]],
      sgstamount: ['', [Validators.required]],
      cgstamount: [''],
      igstamount: [''],
      PreparedDate: ['', [Validators.required]],
    })
    //this.scrapmaster.scrapitems = [{
    //  Scratypeid: 1, ItemId: 101, PriceType: 11, Qty: 10, UnitPrice: 2006, UOM: "akil", BAsicPrice: 1000, Description: "nonndhd"
    //}]
    //this.scrapitems = [
    //  { ItemId: 101, Scratypeid:1, UOM: "123", UnitPrice: "2006", qty: 10, BAsicPrice: 1000, PriceType:11},
    //  { ItemId: 102, Scratypeid:2, UOM: "345", UnitPrice: "2012", qty: 10, BAsicPrice: 1000, PriceType: 11},
    //  { ItemId: 103, Scratypeid:3, UOM: "567", UnitPrice: "2019", qty: 10, BAsicPrice: 1000, PriceType: 11},
    //  { ItemId: 104, Scratypeid:4, UOM: "890", UnitPrice: "2008", qty: 10, BAsicPrice: 1000, PriceType: 11}
    //]
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    if (name == "ItemId")
      this.dynamicData.query = "select  MAX(RFQRevisions_N.RFQType) as RFQType,MAX(RFQRevisions_N.QuoteValidTo) as QuoteValidTo, Material,MAX(Materialdescription) as Materialdescription from MaterialMasterYGS left join RFQItems_N on RFQItems_N.ItemId =MaterialMasterYGS.Material left join RFQRevisions_N on RFQRevisions_N.rfqRevisionId =RFQItems_N.RFQRevisionId" + this.dynamicData.searchCondition + " ";
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
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    //if (item.listName == "venderid") {
    //  this.vendorDetails.Vendorid = item.code;
    //  this.vendorDetails.VendorName = item.name;
    //  this.padetails.venderid = item.code;
    //}
     if (item.listName == "DepartmentId") {
      //this.department.DepartmentId = item.code;
       //this.department.Department = item.name;
       this.scrapmaster.RequesterDepartmentID = item.code;
       this.scrapmaster.DepartmentName = item.name;
    }
    //else if (item.listName == "vendorProjectManager") {
    //  this.projectmanger.EmployeeNo = item.code;
    //  this.projectmanger.Name = item.name;
    //  this.padetails.vendorProjectManager = item.code;
    //}
    //else {
    //  this.buyergroups.BuyerGroupId = item.code;
    //  this.buyergroups.BuyerGroup = item.name;
    //  this.padetails.BuyerGroupId = item.code;
    //}
  }

  onRowEditInit(product: ScrapItems, rowid: number) {
    product.Id = rowid+1;
    //this.clonedProducts[product.Id] = { ...product };
  }

  onRowEditSave(product: ScrapItems, rowid: number) {
    console.log("product", product)
    product.Id = rowid;
    //this.scrapmaster.scrapitems.push(product)
    console.log("this.scrapmaster", this.scrapmaster)
    //if (product.price > 0) {
    //  delete this.clonedProducts[product.id];
    //  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    //}
    //else {
    //  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    //}
  }

  onRowEditCancel(product: ScrapItems, index: number) {
    //this.products2[index] = this.clonedProducts[product.id];
    //delete this.products2[product.id];
  }
  newRow() {
    var data = new ScrapItems();
    this.scrapmaster.scrapitems.push(data)
    return { Scratypeid:'', Item: '', Description: '', Quantity: '', UnitPrice: '', HSNCode:'' };
  }
  addFieldValue() {
    //this.scrapmaster.scrapitems.push(this.newAttribute)
    //this.scrapitems = { Scratypeid: 10, ItemId: '34', PriceType: 10, Description: '', BAsicPrice:10,UOM:'akil', Qty: 1, UnitPrice: 10 };
  }
  displayitems() {
    console.log("xxx", this.scrapmaster)
    this.Departmentsubmittted = true;
    if (this.scrappageform.invalid) {
      return;
    }
    this.paService.InsertScrapItems(this.scrapmaster).subscribe(data => {

    })
  }
}
