import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { Employee, DynamicSearchResult, AccessList, searchList, MPRItemInfoes, MPRDocument } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { RfqService } from 'src/app/services/rfq.service ';
import { constants } from 'src/app/Models/MPRConstants';
import { RFQRevisionData, RFQMasters, RfqItemModel, RfqItemInfoModel, RFQGenerateReminderMaster } from 'src/app/Models/rfq';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-RFQForm',
  templateUrl: './RFQForm.component.html'
})
export class RFQFormComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public RfqService: RfqService, public constants: constants, private route: ActivatedRoute, private messageService: MessageService, private spinner: NgxSpinnerService, public sanitizer: DomSanitizer) { }

  //variable Declarations start
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public RFQForm; AddItemForm; addItemInfoForm: FormGroup;
  public rfqRevisionModel: RFQRevisionData;
  public rfqFormEdit; rfqSubmitted; showRfqItem; showList; AddItemDialog; AddItemInfodialog; itemSubmitted; itemInfoSubmitted; AddHandlingChargesDialog: boolean = false;
  public formName: string;
  public txtName: string;
  public selectedItem: searchList;
  public dynamicData = new DynamicSearchResult();
  public searchItems: Array<searchList> = [];
  public searchresult: Array<object> = [];
  public rfqItem: RfqItemModel;
  public rfqItemInfo: RfqItemInfoModel;
  public currncyArray: any[] = [];
  public rfqResponded; HandlingPercentageChk; ImportFreightPercentageChk; InsurancePercentageChk; DutyPercentageChk: boolean = false;
  public RFQGenerateReminderMaster: RFQGenerateReminderMaster;
  public nonMappedItem: Array<MPRItemInfoes> = [];
  public selectedItemList: Array<any> = [];
  public RevisionId: string;
  public MPRRFQDocuments: Array<MPRDocument> = [];
  public selectedDocList: Array<MPRDocument> = [];
  public mprDocument = new MPRDocument();
  public rfqItemList: Array<RfqItemModel> = [];
  public revisionId: string

  //page load eventl
  ngOnInit() {

    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));

    else {
      this.router.navigateByUrl("Login");
      return;
    }
    if (localStorage.getItem("AccessList")) {
      this.AccessList = JSON.parse(localStorage.getItem("AccessList"));
    }
    this.rfqRevisionModel = new RFQRevisionData();
    this.rfqRevisionModel.rfqmaster = new RFQMasters();
    this.rfqRevisionModel.rfqitem = [];
    this.rfqRevisionModel.RFQType = "0";
    this.rfqItem = new RfqItemModel();
    this.rfqItemInfo = new RfqItemInfoModel();
    this.currncyArray = [];

    this.RFQForm = this.formBuilder.group({
      venderid: ['', [Validators.required]],
      RFQType: ['', [Validators.required]],
      QuoteValidFrom: ['', [Validators.required]],
      QuoteValidTo: ['', [Validators.required]],
      VendorVisibility: ['', [Validators.required]],
      RFQResponded: ['', [Validators.required]]
    });

    this.AddItemForm = this.formBuilder.group({
      ItemId: ['', [Validators.required]],
      QuotationQty: ['', [Validators.required]],
      VendorModelNo: ['', [Validators.required]],
      HSNCode: ['', [Validators.required]],
      FreightPercentage: ['', [Validators.required]],
      FreightAmount: ['', [Validators.required]],
      PFPercentage: ['', [Validators.required]],
      PFAmount: ['', [Validators.required]],
      IGSTPercentage: ['', [Validators.required]],
      CGSTPercentage: ['', [Validators.required]],
      SGSTPercentage: ['', [Validators.required]],
      MfgPartNo: ['', [Validators.required]],
      MfgModelNo: ['', [Validators.required]],
      ManufacturerName: ['', [Validators.required]],
      RequestRemarks: ['', [Validators.required]],
    });

    this.addItemInfoForm = this.formBuilder.group({
      StartQty: ['', [Validators.required]],
      EndQty: ['', [Validators.required]],
      Qty: ['', [Validators.required]],
      UnitPrice: ['', [Validators.required]],
      UnitId: ['', [Validators.required]],
      CurrencyId: ['', [Validators.required]],
      CurrencyValue: ['', [Validators.required]],

      DeliveryDays: ['', [Validators.required]],
      DeliveryDate: ['', [Validators.required]],
      ValidFrom: ['', [Validators.required]],
      ValidTo: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      Status: ['', [Validators.required]]
    })

    this.RFQForm.controls['RFQType'].clearValidators();
    this.RFQForm.controls['VendorVisibility'].clearValidators();
    this.RFQForm.controls['RFQResponded'].clearValidators();
    this.AddItemForm.controls['VendorModelNo'].clearValidators();
    this.AddItemForm.controls['MfgPartNo'].clearValidators();
    this.AddItemForm.controls['MfgModelNo'].clearValidators();
    this.AddItemForm.controls['RequestRemarks'].clearValidators();
    this.addItemInfoForm.controls['DeliveryDays'].clearValidators();
    this.addItemInfoForm.controls['DeliveryDate'].clearValidators();
    this.addItemInfoForm.controls['StartQty'].clearValidators();
    this.addItemInfoForm.controls['EndQty'].clearValidators();
    this.addItemInfoForm.controls['Qty'].clearValidators();
    this.addItemInfoForm.controls['UnitId'].clearValidators();


    this.loadCurrency();
    this.route.params.subscribe(params => {
      if (params["RFQRevisionId"] && !this.constants.RequisitionId) {
        var revisionId = params["RFQRevisionId"];
        this.RevisionId = params["RFQRevisionId"];
        this.spinner.show();
        this.loadRFQData(revisionId);

      }
    });
  }

  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    searchTxt = searchTxt.replace('*', '%');
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "venderid")
      this.dynamicData.searchCondition += " OR VendorCode" + " like '%" + searchTxt + "%' ";
    if (this.dynamicData.searchCondition && name == "ItemId")
      this.dynamicData.searchCondition += " OR Material" + " like '%" + searchTxt + "%'" + "group by Material";
    this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    if (name == "ItemId")
      this.dynamicData.query = "select Material,MAX(Materialdescription) as Materialdescription from MaterialMasterYGS left join RFQItems_N on RFQItems_N.ItemId =MaterialMasterYGS.Material left join RFQRevisions_N on RFQRevisions_N.rfqRevisionId =RFQItems_N.RFQRevisionId" + this.dynamicData.searchCondition + " ";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        fName = item[this.constants[name].fieldName];
        if (name == "venderid") {
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
        }
        if (name == "ItemId") {
          fName = item[this.constants[name].fieldName] + " - " + item[this.constants[name].fieldId];
        }
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId] };
        this.searchItems.push(value);
      });

      this.selectedItem = this.searchItems.filter(li => li.code == this.RFQForm[name])[0];
      if (callback)
        callback();
    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;

    if (this.formName != "") {
      this[this.formName].controls[this.txtName].setValue(item.name);
      if (item.listName == "venderid")
        this.rfqRevisionModel.rfqmaster.VendorId = item.code;
      if (item.listName == "ItemId")
        this.rfqItem.ItemId = item.code;
      if (item.listName == "UnitId")
        this.rfqItemInfo.UOM = item.code;

    }
    this[this.formName].controls[this.txtName].updateValueAndValidity()
  }

  loadCurrency() {
    this.RfqService.GetAllMasterCurrency().subscribe(res => {
      //this._list = res; //save posts in array
      //res = res.Result;
      this.currncyArray = res;
      let _list: any[] = [];
      for (let i = 0; i < (res.length); i++) {
        _list.push({
          CurrencyName: res[i].CurrencyName,
          CurrenyId: res[i].CurrencyId
        });
      }
      this.currncyArray = _list;
      this.rfqItemInfo.CurrencyId = "";
    });
  }

  showItemDialog() {
    this.AddItemDialog = true;
    this.rfqItem = new RfqItemModel();
    this.AddItemForm.controls.ItemId.value = "";
    this.AddItemForm.controls['PFAmount'].setValue("0");
    this.AddItemForm.controls['FreightAmount'].setValue("0");
    this.AddItemForm.controls['IGSTPercentage'].setValue("0");

    this.PFAmountChange();
    this.PFPercentageChange();
    this.FreightAmountChange();
    this.FreightPercentageChange();
    this.IGSTPercentageChange();
    this.IGSTEnablefromCGSTChange();
    this.IGSTEnablefromSGSTChange();

  }

  showHandlingChargesDialog() {
    this.AddHandlingChargesDialog = true;
  }

  Cancel(dialog: string) {
    this[dialog] = false;
  }

  dialogCancel(dialogName) {
    this[dialogName] = false;
  }

  onRFQsubmit() {
    this.rfqSubmitted = true;

    if (this.RFQForm.invalid) {
      return;
    }
    else {
      this.rfqRevisionModel.CreatedBy = parseInt(this.employee.EmployeeNo);
      this.rfqRevisionModel.rfqmaster.CreatedBy = this.employee.EmployeeNo;
      if (this.rfqResponded)
        this.rfqRevisionModel.StatusId = 8;//rfq responded
      this.RfqService.CreateRfq(this.rfqRevisionModel).subscribe(data => {
        this.rfqRevisionModel = data;
        this.showRfqItem = true;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Submitted' });

      })
    }
  }

  InsertRFQItem() {
    this.itemSubmitted = true;
    if (this.AddItemForm.invalid) {
      return;
    }
    else {
      if (!this.rfqItem.ItemId) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select item from the list' });
        return;
      }
      this.rfqRevisionModel.rfqitem = [];
      this.rfqRevisionModel.rfqitem.push(this.rfqItem);
      this.spinner.show();
      this.RfqService.CreateRfq(this.rfqRevisionModel).subscribe(data => {
        this.spinner.hide();
        this.rfqRevisionModel = data;
        this.AddItemDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Items Submitted' });
        this.itemSubmitted = false;
      })
    }
  }

  InsertRFQItemInfo() {
    this.itemInfoSubmitted = true;
    if (this.addItemInfoForm.invalid) {
      return;
    }
    else {
      if (this.rfqRevisionModel.RFQType != "Quote")
        this.rfqItemInfo.DeliveryDate = null;
      this.spinner.show();
      this.RfqService.InsertRfqItemInfo(this.rfqItemInfo).subscribe(data => {
        this.spinner.hide();
        this.rfqRevisionModel = data;
        this.AddItemInfodialog = false;
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Items Info Submitted' });
        this.itemInfoSubmitted = false;
      })
    }
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

  PFPercentageChange() {
    if (this.AddItemForm.controls['PFPercentage'].value != "" || this.AddItemForm.controls['PFPercentage'].value == "0") {
      this.AddItemForm.controls['PFAmount'].setValue("");
      this.AddItemForm.controls['PFAmount'].clearValidators();
      this.AddItemForm.controls['PFAmount'].disable();
    }
    this.AddItemForm.controls['PFAmount'].updateValueAndValidity();
  }

  PFAmountChange() {
    if (this.AddItemForm.controls['PFAmount'].value != "" || this.AddItemForm.controls['PFAmount'].value == "0") {
      this.AddItemForm.controls['PFPercentage'].setValue("");
      this.AddItemForm.controls['PFPercentage'].clearValidators();
      this.AddItemForm.controls['PFPercentage'].disable();
    }
    this.AddItemForm.controls['PFPercentage'].updateValueAndValidity();
  }

  FreightPercentageChange() {
    if (this.AddItemForm.controls['FreightPercentage'].value != "" || this.AddItemForm.controls['FreightPercentage'].value == "0") {
      this.AddItemForm.controls['FreightAmount'].setValue("");
      this.AddItemForm.controls['FreightAmount'].clearValidators();
      this.AddItemForm.controls['FreightAmount'].disable();
    }
    this.AddItemForm.controls['FreightAmount'].updateValueAndValidity();
  }

  FreightAmountChange() {
    if (this.AddItemForm.controls['FreightAmount'].value != "" || this.AddItemForm.controls['FreightAmount'].value == "0") {
      this.AddItemForm.controls['FreightPercentage'].setValue("");
      this.AddItemForm.controls['FreightPercentage'].clearValidators();
      this.AddItemForm.controls['FreightPercentage'].disable();
    }
    this.AddItemForm.controls['FreightPercentage'].updateValueAndValidity();
  }
  IGSTPercentageChange() {
    if (this.AddItemForm.controls['IGSTPercentage'].value != "" || this.AddItemForm.controls['IGSTPercentage'].value == "0") {
      this.AddItemForm.controls['SGSTPercentage'].setValue("");
      this.AddItemForm.controls['CGSTPercentage'].setValue("");
      this.AddItemForm.controls['SGSTPercentage'].clearValidators();
      this.AddItemForm.controls['CGSTPercentage'].clearValidators();
      this.AddItemForm.controls['SGSTPercentage'].updateValueAndValidity();
      this.AddItemForm.controls['CGSTPercentage'].updateValueAndValidity();
      this.AddItemForm.controls['SGSTPercentage'].disable();
      this.AddItemForm.controls['CGSTPercentage'].disable();
    }
  }

  IGSTEnablefromCGSTChange() {
    if (this.AddItemForm.controls['CGSTPercentage'].value != "" || this.AddItemForm.controls['CGSTPercentage'].value == "0") {
      this.AddItemForm.controls['IGSTPercentage'].setValue("");
      this.AddItemForm.controls['IGSTPercentage'].clearValidators();
      this.AddItemForm.controls['IGSTPercentage'].updateValueAndValidity();
      this.AddItemForm.controls['IGSTPercentage'].disable()
    }
  }
  IGSTEnablefromSGSTChange() {
    if (this.AddItemForm.controls['SGSTPercentage'].value != "" || this.AddItemForm.controls['SGSTPercentage'].value == "0") {
      this.AddItemForm.controls['IGSTPercentage'].setValue("");
      this.AddItemForm.controls['IGSTPercentage'].clearValidators();
      this.AddItemForm.controls['IGSTPercentage'].updateValueAndValidity();
      this.AddItemForm.controls['IGSTPercentage'].disable()
    }
  }
  rfqTypeChange() {
    if (this.rfqRevisionModel.RFQType == "Rate Contract") {
      this.RFQForm.controls['QuoteValidFrom'].setValidators([Validators.required]);
      this.RFQForm.controls['QuoteValidTo'].setValidators([Validators.required]);
    }
    else {
      this.RFQForm.controls['QuoteValidFrom'].setValue("");
      this.RFQForm.controls['QuoteValidTo'].setValue("");
      this.RFQForm.controls['QuoteValidFrom'].clearValidators();
      this.RFQForm.controls['QuoteValidTo'].clearValidators();
    }
    this.RFQForm.controls['QuoteValidFrom'].updateValueAndValidity();
    this.RFQForm.controls['QuoteValidTo'].updateValueAndValidity();
  }

  showItemInfo(rfqItemId: any, qty: any) {
    this.AddItemInfodialog = true;
    this.rfqItemInfo = new RfqItemInfoModel();
    this.rfqItemInfo.RFQItemsId = rfqItemId;
    this.rfqItemInfo.CurrencyId = "";
    this.rfqItemInfo.Qty = qty;
    if (this.rfqRevisionModel.RFQType == "Rate Contract") {
      this.rfqItemInfo.Status = "Approved";
      this.addItemInfoForm.controls['Status'].setValidators([Validators.required]);
      this.addItemInfoForm.controls['ValidFrom'].setValidators([Validators.required]);
      this.addItemInfoForm.controls['ValidTo'].setValidators([Validators.required]);
    }
    else {
      if (this.rfqRevisionModel.RFQType == "Repeat Order")
        this.rfqItemInfo.Status = "Approved";
      else
        this.rfqItemInfo.Status = "";
      this.addItemInfoForm.controls['Status'].clearValidators();
      this.addItemInfoForm.controls['ValidFrom'].clearValidators();
      this.addItemInfoForm.controls['ValidTo'].clearValidators();
    }
    this.addItemInfoForm.controls['Status'].updateValueAndValidity();
    this.addItemInfoForm.controls['ValidFrom'].updateValueAndValidity();
    this.addItemInfoForm.controls['ValidTo'].updateValueAndValidity();
  }

  onItemEdit(e: any, details: RfqItemModel) {
    this.spinner.show();
    this.rfqItem = details;
    this.AddItemDialog = true;
    var value = { listName: "ItemId", name: details.ItemName + " - " + details.ItemId, code: details.ItemId };
    this.searchItems.push(value);
    this.selectedItem = this.searchItems.filter(li => li.code == details.ItemId)[0];
    if (details.ItemId == "0000")
      this.AddItemForm.controls.ItemId.value = "NewItem";
    else
      this.AddItemForm.controls.ItemId.value = this.searchItems.filter(li => li.listName == "ItemId" && li.code == details.ItemId)[0].name;
    this.AddItemForm.value.ItemId = details.ItemId;
    this.AddItemForm.controls['ItemId'].updateValueAndValidity();
    this.spinner.hide();

    //this.bindSearchListData(e, 'AddItemForm', 'ItemId', "", (): any => {
    //  this.showList = false;
    //  if (details.ItemId == "0000")
    //    this.AddItemForm.controls.ItemId.value = "NewItem";
    //  else
    //    this.AddItemForm.controls.ItemId.value = this.searchItems.filter(li => li.listName == "ItemId" && li.code == details.ItemId)[0].name;
    //  this.AddItemForm.value.ItemId = details.ItemId;
    //  this.AddItemForm.controls['ItemId'].updateValueAndValidity();
    //  this.spinner.hide();
    //});
    if (details.PFAmount || details.PFAmount == "0")
      this.PFAmountChange();
    if (details.PFPercentage || details.PFPercentage == "0")
      this.PFPercentageChange();
    if (details.FreightAmount || details.FreightAmount == "0")
      this.FreightAmountChange();
    if (details.FreightPercentage || details.FreightPercentage == "0")
      this.FreightPercentageChange();
    if (details.IGSTPercentage || details.IGSTPercentage == "0")
      this.IGSTPercentageChange();
    if (details.CGSTPercentage || details.CGSTPercentage == "0")
      this.IGSTEnablefromCGSTChange();
    if (details.SGSTPercentage || details.SGSTPercentage == "0")
      this.IGSTEnablefromSGSTChange();

  }

  onItemInfoEdit(e: any, details: RfqItemInfoModel) {
    this.rfqItemInfo = details;
    this.currncyArray = this.currncyArray;
    if (!this.rfqItemInfo.CurrencyId)
      this.rfqItemInfo.CurrencyId = "";
    this.AddItemInfodialog = true;
    this.rfqItemInfo.ValidFrom = new Date(this.rfqItemInfo.ValidFrom);
    this.rfqItemInfo.ValidTo = new Date(this.rfqItemInfo.ValidTo);

    if (details.UOM) {
      this.bindSearchListData(e, 'addItemInfoForm', 'UnitId', "", (): any => {
        this.showList = false;
        this.addItemInfoForm.controls['UnitId'].setValue(this.searchItems.filter(li => li.listName == "UnitId" && li.code == details.UOM)[0].name);
        this.addItemInfoForm.value.UnitId = details.UOM;
        this.addItemInfoForm.controls['UnitId'].updateValueAndValidity()
      });
    }

    if (this.rfqRevisionModel.RFQType == "Rate Contract") {
      this.addItemInfoForm.controls['Status'].setValidators([Validators.required]);
      this.addItemInfoForm.controls['ValidFrom'].setValidators([Validators.required]);
      this.addItemInfoForm.controls['ValidTo'].setValidators([Validators.required]);
      this.addItemInfoForm.controls["ValidFrom"].setValue(this.rfqItemInfo.ValidFrom);
      this.addItemInfoForm.controls["ValidTo"].setValue(this.rfqItemInfo.ValidTo);
    }
    else {
      this.addItemInfoForm.controls['Status'].clearValidators();
      this.addItemInfoForm.controls['ValidFrom'].clearValidators();
      this.addItemInfoForm.controls['ValidTo'].clearValidators();
    }
    this.addItemInfoForm.controls['Status'].updateValueAndValidity();
    this.addItemInfoForm.controls['ValidFrom'].updateValueAndValidity();
    this.addItemInfoForm.controls['ValidTo'].updateValueAndValidity();


  }
  ondeleteRFQItem(rfqItem: RfqItemModel, itemindex: number) {
    this.RfqService.DeleteRfqItemByid(rfqItem.RFQItemsId).subscribe(data => {
      var index1 = this.rfqRevisionModel.rfqitem.findIndex(x => x.RFQItemsId == rfqItem.RFQItemsId);
      this.rfqRevisionModel.rfqitem.splice(index1, 1);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Deleted' });

    })
  }

  ondeleteRFQItemInfo(rfqItemInfo: RfqItemInfoModel, itemindex: number, index: number) {
    this.RfqService.DeleteRfqIteminfoByid(rfqItemInfo.RFQSplitItemId).subscribe(data => {
      var index1 = this.rfqRevisionModel.rfqitem[itemindex].iteminfo.findIndex(x => x.RFQSplitItemId == rfqItemInfo.RFQSplitItemId);
      this.rfqRevisionModel.rfqitem[itemindex].iteminfo.splice(index1, 1);
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Deleted' });
    })
  }
  loadRFQData(revisionId: number) {
    this.RfqService.GetRfqDetailsById(revisionId).subscribe(data => {
      this.rfqRevisionModel = data;
      if (this.rfqRevisionModel.StatusId && this.rfqRevisionModel.StatusId == 8)
        this.rfqResponded = true;
      this.RFQForm.controls["QuoteValidFrom"].setValue(this.rfqRevisionModel.QuoteValidFrom);
      this.RFQForm.controls["QuoteValidTo"].setValue(this.rfqRevisionModel.QuoteValidTo);

      this.showRfqItem = true;
      this.spinner.hide();
      this.RFQForm.controls["venderid"].setValue(this.rfqRevisionModel.rfqmaster.Vendor.VendorName);
      this.rfqTypeChange();
      this.GetUnMappedMPRItems(this.rfqRevisionModel.rfqmaster.MPRRevisionId);
      this.rfqItemList = this.rfqRevisionModel.rfqitem;
    })
  }

  //Binding selected units
  public BindUnits(unitId: number) {
    if (unitId == 1)
      return "Nos"
    if (unitId == 2)
      return "Set"
    if (unitId == 3)
      return "Kgs"
    else
      return "";

  }

  //bind status Text
  getStatusText(statusId: any) {
    if (statusId == 7)
      return 'RFQ Generated';
    else if (statusId == 8)
      return 'RFQ Responded'
    else if (statusId == 17)
      return 'RFQ Finalized';
    else
      return '';
  }

  //update handling charges
  updateHandlingCharges() {
    this.spinner.show();
    this.RfqService.updateHandlingCharges(this.rfqRevisionModel.rfqitem).subscribe(data => {
      this.spinner.hide();
      this.AddHandlingChargesDialog = false;
      if (data)
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Handling charges Updated' });
    })

  }

  //copy handling charges
  copyCharges(event: any, type: any)  {

    //handling charges
    if (type == 'HandlingPercentage' && !this.rfqRevisionModel.rfqitem[0].HandlingPercentage) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Handling Percentage in first text box' });
      event.target.checked = false;
      return false;
    }
    if (event.target.checked == true && type == 'HandlingPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        item.HandlingPercentage = this.rfqRevisionModel.rfqitem[0].HandlingPercentage;
      })
    }

    if (event.target.checked == false && type == 'HandlingPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        if (index > 0)
          item.HandlingPercentage = "";
      })
    }

    //import charges
    if (type == 'ImportFreightPercentage' && !this.rfqRevisionModel.rfqitem[0].ImportFreightPercentage) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Import Freight Percentage in first text box' });
      event.target.checked = false;
      return false;
    }

    if (event.target.checked == true && type == 'ImportFreightPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        item.ImportFreightPercentage = this.rfqRevisionModel.rfqitem[0].ImportFreightPercentage;
      })
    }

    if (event.target.checked == false && type == 'ImportFreightPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        if (index > 0)
          item.ImportFreightPercentage = "";
      })
    }


    //Insurance  charges
    if (type == 'InsurancePercentage' && !this.rfqRevisionModel.rfqitem[0].InsurancePercentage) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter  Insurance Percentage in first text box' });
      event.target.checked = false;
      return false;
    }
    if (event.target.checked == true && type == 'InsurancePercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        item.InsurancePercentage = this.rfqRevisionModel.rfqitem[0].InsurancePercentage;
      })
    }

    if (event.target.checked == false && type == 'InsurancePercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        if (index > 0)
          item.InsurancePercentage = "";
      })
    }

    //Duty charges
    if (type == 'DutyPercentage' && !this.rfqRevisionModel.rfqitem[0].DutyPercentage) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter  Duty Percentage in first text box' });
      event.target.checked = false;
      return false;
    }

    if (event.target.checked == true && type == 'DutyPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        item.DutyPercentage = this.rfqRevisionModel.rfqitem[0].DutyPercentage;
      })
    }

    if (event.target.checked == false && type == 'DutyPercentage') {
      this.rfqRevisionModel.rfqitem.forEach((item, index) => {
        if (index > 0)
          item.DutyPercentage = "";
      })

    }
  }

  //send reminder mail to vendor
  sendRFQGenerateReminder() {
    this.RFQGenerateReminderMaster = new RFQGenerateReminderMaster();
    this.RFQGenerateReminderMaster.VendorId = this.rfqRevisionModel.rfqmaster.VendorId;
    this.RFQGenerateReminderMaster.FrmEmailId = this.employee.EmployeeNo;
    this.RFQGenerateReminderMaster.rfqno = this.rfqRevisionModel.rfqmaster.RFQNo;
    this.RFQGenerateReminderMaster.Reminder = true;
    this.spinner.show();
    this.RfqService.SendRFQGeneratedEmail(this.RFQGenerateReminderMaster).subscribe(data => {
      this.spinner.hide();
      if (data)
         this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Reminder Sent' });
    })
  }

  GetUnMappedMPRItems(MPRrevisionid) {
    var qry = "select distinct Itemdetailsid as MRPItemsDetailsID,Itemid,RevisionId as MPRRevisionId,ItemDescription as ItemDescription,Quantity as QuotationQty,MPRItemInfo.UnitId,UnitName,SaleOrderNo,SOLineItemNo,MfgPartNo from MPRItemInfo ";
    qry = qry + " inner join RfqMAster on RfqMAster.MPRRevisionId=MPRItemInfo.RevisionId  inner join RfqRevisions_N on RfqRevisions_N.rfqMasterId=RfqMAster.RfqMasterId left join UnitMaster on UnitMaster.UnitId=MPRItemInfo.UnitId ";
    qry = qry + " where RevisionId=" + MPRrevisionid + " and Itemdetailsid not in (select MPRItemDetailsid from RFQItems_N where RFQRevisionId in";
    qry = qry + " (select rfqRevisionId from RFQRevisions_N where rfqMasterId in (select RfqMasterId from RFQMaster where MPRRevisionId=" + MPRrevisionid + " )))";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = qry;
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.nonMappedItem = data;
      this.dynamicData.query = "select * from MPRDocuments where RevisionId=" + MPRrevisionid + " and DocumentTypeid=1"
      this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
        this.MPRRFQDocuments = data;
      });
    });
  }

  selectItemList(event: any, itemDetails: any) {
    var index = this.selectedItemList.findIndex(x => x.Itemdetailsid == itemDetails.Itemdetailsid);
    if (event.currentTarget.checked) {
      itemDetails.RFQRevisionId = this.RevisionId;

      this.selectedItemList.push(itemDetails);
    }
    else {
      this.selectedItemList.splice(index, 1);
    }
  }

  selectDoc(event, index: any, mprdoc: any, rowIndex: any, itemDetails: any) {
    if (event.target.checked == true) {
      (<HTMLInputElement>document.getElementById("chk" + rowIndex)).checked = true;
      this.selectItemList(event, itemDetails);
    }

    var index1 = this.selectedDocList.findIndex(x => x.MprDocId == mprdoc.MprDocId && x.VendorId == mprdoc.VendorId);
    if ((<HTMLInputElement>document.getElementById("doc" + index + mprdoc.MprDocId)).checked == true) {
      this.mprDocument = new MPRDocument();
      this.mprDocument.MprDocId = mprdoc.MprDocId;
      this.mprDocument.Path = mprdoc.Path;
      this.mprDocument.DocumentName = mprdoc.DocumentName;
      this.mprDocument.ItemDetailsId = mprdoc.ItemDetailsId;
      this.mprDocument.DocumentTypeid = mprdoc.DocumentTypeid;
      this.mprDocument.UploadedBy = this.employee.EmployeeNo;
      this.selectedDocList.push(this.mprDocument);
    }
    else {
      this.selectedDocList.splice(index1, 1);
    }
  }
  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }

  saveUnmappedItem() {
    if (this.selectedItemList.length > 0) {
      this.spinner.show();
      this.RfqService.UpdateUnMappedItem(this.selectedItemList, this.selectedDocList).subscribe(data => {
        this.spinner.hide();
        if (data == 1)
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Items Mapped' });
         this.loadRFQData(parseInt(this.RevisionId))
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select atleast one item!' });
    }

  }

  MapMPRDoctoRFQDoc(MPRDocument: any) {
    MPRDocument.RfqRevisionId = parseInt(this.RevisionId);
    MPRDocument.UploadedBy = this.employee.EmployeeNo;

    var rfqDocuments = this.rfqItemList.filter(x => x.MRPItemsDetailsID == MPRDocument.ItemDetailsId).map(c => c.RFQDocuments)[0];

    var Result = rfqDocuments.filter(li => li.DocumentName == MPRDocument.DocumentName);
    
    if (Result.length == 0) {
      this.spinner.show();
      this.RfqService.UpdateMapMPRDoctoRFQDoc(MPRDocument).subscribe(data => {
        this.loadRFQData(MPRDocument.RfqRevisionId);
        if (data == 1)
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Document Successfully Mapped' });
        else if (data == 2)
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Document Already Mapped' });
        else
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'RFQ Document not Mapped' });

      })
    }
    else
    {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Document Already Mapped' });
    }

  }

  UNMapRFQDocumnet(MPRDocument: any) {
    MPRDocument.RfqRevisionId = parseInt(this.RevisionId);
    MPRDocument.UploadedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.RfqService.UnMapRFQDocumnet(MPRDocument).subscribe(data => {
      this.loadRFQData(MPRDocument.RfqRevisionId);
      if (data == 1)
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'RFQ Document Successfully Removed' });
      else
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'RFQ Document not Removed' });

    })
  }
  Excel() {
    this.MprService.downLoadRFQInfoExcel(this.revisionId).subscribe(data => { this.downloadFile(data) });
  }

  DownLoadExcel() {
    this.MprService.downLoadRFQInfoExcel(this.RevisionId).subscribe(data => { this.downloadFile(data) });
  }


  downloadFile(data: Blob) {
    const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const currentdate = new Date();
    FileSaver.saveAs(blob, 'RfqData_' + currentdate + '_' + this.revisionId + '.xlsx');
  }



  uploadExcel(event: any) {
    this.spinner.show();
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var id = this.employee.EmployeeNo;
      formData.append(id, file, file.name);
      this.MprService.UploadRfqData(formData, this.revisionId).subscribe({
        next: data => {

          if (data.ErrorMessage) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.ErrorMessage });
            this.spinner.hide();
            return;
          }

          if (data) {
            console.log(data);
            this.spinner.hide();
            this.messageService.add({ severity: 'sucess', summary: 'Sucess Message', detail: 'file uploaded' });
          }
        }, error: error => {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: error.message });
          this.spinner.hide();
        }
      });
    }
  }
}






