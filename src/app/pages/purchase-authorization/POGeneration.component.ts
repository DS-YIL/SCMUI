import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { PADetailsModel, ItemsViewModel, EmployeeModel, ProjectManager, POMaster, POItem } from 'src/app/Models/PurchaseAuthorization'
import { MPRVendorDetail, DynamicSearchResult, searchList, mprRevision, MPRItemInfoes, MPRBuyerGroup, Employee, Department } from 'src/app/Models/mpr'
import { constants } from 'src/app/Models/MPRConstants'
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-POGeneration',
  templateUrl: './POGeneration.component.html',
})
export class POGenerationComponent implements OnInit {
  selectedItems1 = [];

  constructor(public paService: purchaseauthorizationservice, private datePipe: DatePipe, public messageservice: MessageService, public constants: constants, public mprservice: MprService, private routing: Router, private activeroute: ActivatedRoute) {

  }
  public hivalue = true;
  public poedit: boolean = false;
  public Vendorid: number;
  public approvevalue = false;
  //public checked: boolean;
  public MPRPageForm1: FormGroup;
  public disableSubmit: boolean = true;
  public department: Department;
  public buyergroups: MPRBuyerGroup;
  public projectmanger: ProjectManager;
  public padetails: PADetailsModel;
  public employee: Employee;
  public paitemdetails: Array<any> = [];
  public filteredResult: Array<ItemsViewModel> = [];
  public paitem: ItemsViewModel;
  public vendorDetails: MPRVendorDetail;
  public itemDetails: Array<any> = [];
  public itemsbasedonvendor: Array<any> = [];
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public searchresult: Array<object> = [];
  public searchItems: Array<searchList> = [];
  public showList: boolean = false;
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public formName: string;
  public mprRevisionModel: mprRevision;
  public dialogTop: string;
  public multiSelect: boolean;
  public vendorSubmitted; MPRForm1Submitted; Departmentsubmittted; projectmangersubmitted;
  public selectedbox: any;
  public selectedItems: Array<any> = [];
  public VendorName: string;
  public paid: Array<any> = [];
  public pomaster: POMaster;
  public poinsert: any;
  public poid: any;
  public isReadonly: boolean;
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.routing.navigateByUrl("Login");
    }
    this.padetails = new PADetailsModel();
    this.vendorDetails = new MPRVendorDetail();
    this.buyergroups = new MPRBuyerGroup();
    this.projectmanger = new ProjectManager();
    this.paid = new Array<any>();
    this.itemDetails = new Array<any>();
    this.itemsbasedonvendor = new Array<any>();
    this.pomaster = new POMaster();
    this.pomaster.poitems = new Array<POItem>();
    this.pomaster.scmpoconfirmation = this.employee.EmployeeNo;
    this.pomaster.scmpoconfirmationby = this.employee.Name;
    this.isReadonly = true;
    this.activeroute.params.subscribe(params => {
      if (params["POID"]) {
        this.poid = params["POID"];
        this.GetpoitemsByPoId();
        console.log("poid", this.poid)
      }
    })
    if (localStorage.getItem("Poitems")) {
      this.selectedItems = JSON.parse(localStorage.getItem("Poitems"));
      for (var i = 0; i < this.selectedItems.length; i++) {
        this.paid.push(this.selectedItems[i]['PAId'])
      }
      this.loadpogenrationitems(this.paid);
      this.txtName = this.selectedItems[0]['VendorId']
      this.loadpogenerationitemsbyvendor(this.txtName);
      console.log("pogeneration", this.selectedItems)
      localStorage.removeItem("Poitems");
    }
  }
  loadpogenrationitems(PAId: any) {
    this.paService.LoadItemsForPOGeneration(PAId).subscribe(data => {
      this.itemDetails = data;
      console.log("itemmisiinh", this.itemDetails)
      //this.pomaster.poterms = 'YIL Sale Order Ref:' + '\n' + this.itemDetails[0]['JobCode'] + '--' + this.itemDetails[0]['Endusername'] + '--' + this.itemDetails[0]['DocumentNo'] + '\n' + 'Suppliers Reference:' + this.itemDetails[0]['PaymentTermRemarks'] +'-'+ this.itemDetails[0]['RFQNo']+'\n' +'Terms and conditions:' + '\n' + '01.Packing & Forwarding :' + this.itemDetails[0]['PackagingForwarding'] + '\n' + '02. Freight :' + this.itemDetails[0]['Freight'] + '\n' + '03. Delivery Date :' + this.pomaster.Reqdeliverydate + '\n' + '04. Mode of Despatch :' + this.itemDetails[0]['ShipmentMode'] + '\n' + '05. Insurance : ' + this.itemDetails[0]['painsurance'] + '\n' + '06. Liquidated Damages:' + this.itemDetails[0]['LDPenaltyTerms'] + '\n' +
      //  '07. Bank Guarantee : ' + this.itemDetails[0]['BankGuarantee'] + '\n' + '08. Warranty :' + this.itemDetails[0]['Warranty'] + '\n' + '09. Payment Terms:' + this.itemDetails[0]['PaymentTerms'] +'\n'+
      //  '10.Special Instructions:' + '\n' + 'A. DRAWINGS AND DATA SHEETS TO BE SUBMITTED FOR ISSUING MANUFACTURING CLEARANCE.' + '\n' + 'B. TEST REPORTS TO BE SUBMITTED FOR ARRANGING TPI INSPECTION FROM BHEL AT YOUR WORKS. ALL TEST REPORTS TO BE SUBMITTED ALONG WITH MATERIALS.' + '\n' + 'C. MATERIAL TEST REPORT, INTERNAL TCS AND WARRANTY CERTIFICATES TO BE PROVIDED ALONG WITH MATERIALS.';
      //console.log("detailstry", this.itemDetails.filter((v, i, arr) => arr.findIndex(t => t.DocumentNo === v.DocumentNo) === i))
      //this.itemDetails.filter((v, i, arr) => arr.findIndex(t => t.DocumentNo === v.DocumentNo) === i)
    })
  }
  changed(event: any) {
    //for (var i = 0; i < this.itemDetails.length; i++) {

    //}
    var multiplempr = this.itemDetails.filter((v, i, arr) => arr.findIndex(t => t.DocumentNo === v.DocumentNo) === i);
    console.log("multiplempr", multiplempr)
    this.pomaster.poterms = '';
    var dat = '';
    if (multiplempr.length >= 1) {
      for (var i = 0; i < multiplempr.length; i++) {
        dat += 'YIL Sale Order Ref:' + '\n' + multiplempr[i]['JobCode'] + '--' + multiplempr[i]['JobName']+'--' + multiplempr[i]['SaleOrderNo'] + '--' + multiplempr[i]['DocumentNo'] + '\n' + 'YIL Reference:' + this.itemDetails[i]['PaymentTermRemarks'] + '-' + this.itemDetails[i]['RFQNo'] + '\n' + '\n';
        console.log("dat", dat)
      }
    }
    this.pomaster.poterms = dat + '\n' + 'Terms and conditions:' + '\n' + '01.Packing & Forwarding :' + this.itemDetails[0]['PackagingForwarding'] + '\n' + '02. Freight :' + this.itemDetails[0]['Freight'] + '\n' + '03. Delivery Date :' + this.datePipe.transform(this.pomaster.Reqdeliverydate, "dd-MM-yyyy") + '\n' + '04. Mode of Dispatch :' + this.itemDetails[0]['ShipmentMode'] + '\n' + '05. Insurance : ' + this.itemDetails[0]['painsurance'] + '\n' + '06. Liquidated Damages :' + this.itemDetails[0]['LDPenaltyTerms'] + '\n' +
      '07. Bank Guarantee : ' + this.itemDetails[0]['BankGuarantee'] + '\n' + '08. Warranty :' + this.itemDetails[0]['Warranty'] + '\n' + '09. Payment Terms :' + this.itemDetails[0]['PaymentTerms'] + '\n' +
      '10.Special Instructions:' + '\n' + 'A. DRAWINGS AND DATA SHEETS TO BE SUBMITTED FOR ISSUING MANUFACTURING CLEARANCE.' + '\n' + 'B. TEST REPORTS TO BE SUBMITTED FOR ARRANGING TPI INSPECTION FROM BHEL AT YOUR WORKS. ALL TEST REPORTS TO BE SUBMITTED ALONG WITH MATERIALS.' + '\n' + 'C. MATERIAL TEST REPORT, INTERNAL TCS AND WARRANTY CERTIFICATES TO BE PROVIDED ALONG WITH MATERIALS.';
    //console.log("details", this.itemDetails.map(x => x.DocumentNo))
  }
  loadpogenerationitemsbyvendor(VendorId: any) {
    this.paService.LoadItemsforpogenerationbasedonvendor(VendorId, this.paid).subscribe(data => {
      this.itemsbasedonvendor = data;
    })
  }
/*Name of Function : <<displayitems>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<getting approved items and items which are not done PA>>
Review Date :<<>>   Reviewed By :<<>>*/
  displayitems(padetails: PADetailsModel) {
    this.paService.LoadPOItems(padetails).subscribe(data => {
      //this.paitemdetails[0].itemsum = data[0].QuotationQty * data[0].UnitPrice;
      this.paitemdetails = data;
      console.log("paitemdetails", this.paitemdetails)
    })
    }

  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

/*Name of Function : <<displayapproveitems>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<tranferring selected items data to purchasepayment page>>
Review Date :<<>>   Reviewed By :<<>>*/
  displayapproveitems() {
    let dataa: any = this.selectedItems;
    localStorage.setItem("PADetails", JSON.stringify(this.selectedItems));
    this.routing.navigateByUrl("/SCM/mprpa");
    // this.paService.getdata(this.selectedItems);
  }
  previousitems() {
    let dataa: any = this.selectedItems;
    this.paService.getdata(this.paitemdetails, dataa);
  }

  onclickbox(selectitems: any[]) {
    this.paitemdetails = selectitems;
  }
  onChange1(event, item: any) {
    if (event.currentTarget.checked) {
      (<HTMLInputElement>document.getElementById("po" + item.RFQSplitItemId)).checked = true;
      var poitems = new POItem();
      poitems.paitemid = item.PAItemID;
      this.pomaster.poitems.push(poitems);
    }
  }
  choosevarianttype(type: string, event: any) {
    console.log("pomaster", this.pomaster)
    if (type == 'Material') {
      this.pomaster.itemtype = 'Material'
      this.isReadonly = false;
    }
    else {
      this.pomaster.itemtype = 'Service'
      this.isReadonly = false;
    }
    if (event.currentTarget.checked) {
      for (var i = 0; i < this.itemDetails.length; i++) {
        if (type != this.itemDetails[i]['POItemType']) {
          (<HTMLInputElement>document.getElementById("po" + this.itemDetails[i].RFQSplitItemId)).disabled = true;
        }
      }
    }
    else {
      for (var i = 0; i < this.itemDetails.length; i++) {
        (<HTMLInputElement>document.getElementById("po" + this.itemDetails[i].RFQSplitItemId)).disabled = false;
      }
    }
  }
/*Name of Function : <<selectAll>>  Author :<<Akhil>>
Date of Creation <<>>
Purpose : <<Selecting the all items of selected vendor>>
Review Date :<<>>   Reviewed By :<<>>*/
  selectAll(event, items: any[]) {
    if (this.pomaster.itemtype) {
      if (event.currentTarget.checked) {
        for (var i = 0; i < items.length; i++) {
          if (this.pomaster.itemtype == items[i]['POItemType']) {
            (<HTMLInputElement>document.getElementById("po" + items[i].RFQSplitItemId)).checked = true;
            console.log("xxx", <HTMLInputElement>document.getElementById("po" + items[i].RFQSplitItemId))
            var poitems = new POItem();
            poitems.paitemid = items[i].PAItemID;
            this.pomaster.poitems.push(poitems);
          }
        }
        for (var k = 0; k < items.length; k++) {
          if (this.pomaster.itemtype != items[k]['POItemType']) {
            (<HTMLInputElement>document.getElementById("po" + items[k].RFQSplitItemId)).disabled = true;
          }
        }
      }
      else {
        for (var i = 0; i < items.length; i++) {
          (<HTMLInputElement>document.getElementById("po" + items[i].RFQSplitItemId)).checked = false;
          this.pomaster.poitems.splice(0, this.pomaster.poitems.length)
        }
      }
    }
    else {
      event.target.checked = false;
      this.messageservice.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please Select  Item Type' })
    }
  }
  selectAlll(event) {
    if (this.itemDetails) {
            //this.filteredResult = this.paitemdetails.filter(li => li.VendorId == this.Vendorid);
            this.filteredResult.forEach((vendor, index) => {
                var index1 = this.selectedItems.findIndex(li => (li.VendorId == this.Vendorid) && (li.Mprrfqsplititemid == vendor.Mprrfqsplititemid));
                if (event.currentTarget.checked && vendor.VendorId == this.Vendorid && (<HTMLInputElement>document.getElementById("vendor" + vendor.Mprrfqsplititemid))) {
                    if (index1 < 0) {
                        (<HTMLInputElement>document.getElementById("vendor" + vendor.Mprrfqsplititemid)).checked = true;
                        this.selectedItems.push(vendor);
                    }
                }
                else {
                    if (event.currentTarget.checked == false && vendor.VendorId == this.Vendorid && index1 >= 0 && (<HTMLInputElement>document.getElementById("vendor" + vendor.Mprrfqsplititemid))) {
                        this.selectedItems.splice(index1, 1);
                        (<HTMLInputElement>document.getElementById("vendor" + vendor.Mprrfqsplititemid)).checked = false;
                        if (this.selectedItems.length === 0) {
                            this.Vendorid = null
                            this.disableSubmit = true;
                        }
                    }
                }
            });
        }
        else {
            event.target.checked = false;
            this.messageservice.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please Select One Item' })
        }
  }
  selecteachitem(event, data: any) {
    var filteredResult = this.itemDetails.findIndex(li => li.RFQSplitItemId == data.RFQSplitItemId);
    if (event.currentTarget.checked) {
      if (filteredResult > -1) {
        this.pomaster.poitems.push(data);
      }
    }
    else {
      this.pomaster.poitems.splice(filteredResult, 1)
      console.log("this.p", filteredResult)
    }
  }
  InsertPoitems(pomaster: POMaster) {
    if (!this.pomaster.Reqdeliverydate) {
      this.messageservice.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please Enter Reqdeliverydate' });
      return;
    }
    if (pomaster.poitems.length > 0) {
      pomaster.departmentid = this.selectedItems[0].DepartmentID;
      pomaster.BuyerGroupID = this.selectedItems[0].BuyerGroupId;
      pomaster.VendorCode = this.selectedItems[0].VendorId;
      pomaster.preparedby = this.employee.EmployeeNo;
      this.paService.InsertPoitems(pomaster).subscribe(data => {
        this.messageservice.add({ severity: 'success', summary: 'success Message', detail: 'POItems Inserted Succesfully' });
        this.poid = data.Sid;
        this.paService.GetPolineItemsToExcel(this.poid).subscribe(data => {
          this.downloadFile(data)
        })
        this.GetpoitemsByPoId();
      })
    }
    else {
      this.messageservice.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please Select One Item' });
    }
  }
  downloadFile(data: Blob) {
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const currentdate = new Date();
    FileSaver.saveAs(blob, 'RfqData_' + currentdate + '_'  + '.xlsx');
  }

  public bindSearchListData(e: any, name?: string, searchTxt?: string, callback?: () => any): void {
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (name == "BuyerGroupMembers")
      this.dynamicData.query = "select mbgm.GroupMember, e.Name as EmployeeName from MPRBuyerGroupMembers mbgm inner join Employee e on e.EmployeeNo=mbgm.GroupMember";
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
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (item.listName == "BuyerGroupMembers") {
      //this.scrapflowform.controls['Inchargename'].setValue(item.name);
      //this.scrapflowform.value['Inchargename'] = item.name;
      this.pomaster.scmpoconfirmation = item.code;
      this.pomaster.scmpoconfirmationby = item.name;
      //this.scrapflowmodel.Incharge = item.code;
    }
  }
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }
  GetpoitemsByPoId() {
    this.paService.GetpoitemsByPoId(this.poid).subscribe(data => {
      this.hivalue = false;
      this.poedit = true;
      this.poinsert = data;
    })
  }

}
