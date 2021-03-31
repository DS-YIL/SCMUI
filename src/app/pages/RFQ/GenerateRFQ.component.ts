import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { RfqService } from 'src/app/services/rfq.service ';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, DynamicSearchResult, searchList, MPRVendorDetail, VendorMaster, PoFilterParams, MPRDocument } from 'src/app/Models/mpr';
import { mappingitems, rfqQuoteModel, RFQRevisionData } from 'src/app/Models/rfq';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-RFQItems',
  templateUrl: './GenerateRFQ.component.html'
})

export class GenerateRFQComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, public RfqService: RfqService, public MprService: MprService, private spinner: NgxSpinnerService, public constants: constants, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  public newVendor: FormGroup;
  public employee: Employee;
  public formName: string;
  public txtName: string;
  public dynamicData = new DynamicSearchResult();
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public showList; showVendorDialog; showConformationDialog; showRevisionsDialog; assignRoDialog: boolean = false;
  public vendorDetails: MPRVendorDetail;
  public vendorDetailsArray: Array<MPRVendorDetail> = [];
  public vendorSubmitted: boolean = false;
  public totalRfqItems: Array<any> = [];
  public MPRRevisionId: number;
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorsLength: number = 2;
  public selectedIndex: string;
  public selectedVendorList: Array<any> = [];
  public cols: any[];
  public RFQRevisionData: RFQRevisionData;
  public YILTermsAndConditions: Array<any> = [];
  public mprVendors; showNewVendor; RateContract; showTerms: boolean = false;
  public newVendorDetails: VendorMaster;
  public vendorEmailList: Array<any> = [];
  public repeatOrdervendorDetailsList: Array<any> = [];
  public selectedRrepeatOrdervendorDetails: Array<any> = [];
  public rfqIndex; MPRItemDetailsid: number;
  public PoFilterParams: PoFilterParams;
  public mprRevisiondata: Array<any> = [];
  public MPRRFQDocuments: Array<MPRDocument> = [];
  public selectedDocList: Array<MPRDocument> = [];
  public showDocumentUpload: boolean = false;
  public mprDocument = new MPRDocument();
  public selectedDocVendors: any[];
  public DocListVendors: any[];
  public docName; path: string = "";
  public EditDialog: boolean;
  public ItemDetailsid: Array<any> = [];
  public PreviousDetails: Array<any> = [];
  public UniqueVendors: any[];
  public vendorcols: any[];
  public currenitem: any[];
  public selecteditems: Array<any> = [];
  public MappingItems: mappingitems;
  public mappedboolean: boolean = true;
  public Recreateitems: boolean;
  public rfqitemsid: Array<any> = [];
  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else {
      this.router.navigateByUrl("Login");
      return true;
    }

    this.vendorDetails = new MPRVendorDetail();
    this.RFQRevisionData = new RFQRevisionData();
    this.newVendorDetails = new VendorMaster();
    this.PoFilterParams = new PoFilterParams();
    //this.MappingItems = new mappingitems();
    this.newVendor = this.formBuilder.group({
      VendorName: ['', [Validators.required]],
      Emailid: ['', [Validators.required]],
      ContactNo: ['', [Validators.required, Validators.maxLength(10)]]
    })


    this.route.params.subscribe(params => {
      if (params["MPRRevisionId"]) {
        this.MPRRevisionId = params["MPRRevisionId"];
        this.getMPRData();
        this.getRFQItems();
      }
    });
    this.RFQRevisionData.RfqValidDate = this.constants.rfqValidDays;;
  }

  //Get MPRData
  getMPRData() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select top(1) RevisionNo,DocumentNo,DocumentDescription,IssuePurposeId, DepartmentName,ProjectManagerName,JobCode,JobName,GEPSApprovalId,SaleOrderNo,ClientName,PlantLocation,BuyerGroupName from MPRRevisionDetails where revisionid=" + this.MPRRevisionId + " ";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.mprRevisiondata = data;
    });
  }

  //Get total generated RFQ Items
  getRFQItems() {
    this.RfqService.getRFQItems(this.MPRRevisionId).subscribe(data => {
      this.totalRfqItems = data;
      this.dynamicData = new DynamicSearchResult();
      //this.dynamicData.tableName = "MPRVendorDetails";
      this.dynamicData.query = "select mat.Materialdescription as ItemName,mi.Itemid as ItemId,mi.Itemdetailsid as MPRItemDetailsid, vm.Vendorid as VendorId,mi.RevisionId as MPRRevisionId, mi.Quantity as MprQuantity,rc.UnitPrice,(select count(*) as cnt from RateContract  where  ItemId=mi.Itemid and RateContract.VendorId=vm.VendorId and (mi.Quantity  between StartQty and EndQty)  and(GETDATE() between ValidFrom and ValidTo)) as RateContract,rc.RFQItemsId as RFQItemId,* from MPRVendorDetails mv inner join MPRItemInfo mi on mi.RevisionId=mv.RevisionId and mi.deleteflag=0 inner join MaterialMasterYGS mat on mat.Material = mi.itemid inner join  VendorMaster vm on vm.Vendorid = mv.Vendorid left join ratecontract rc on rc.ItemId=mi.Itemid and  rc.VendorId=vm.Vendorid and  mi.Quantity between StartQty and EndQty where mi.RevisionId = " + this.MPRRevisionId + "";
      this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
        this.vendorDetailsArray = data;
        if (this.totalRfqItems.length == 0) {
          this.totalRfqItems = data;
          this.mprVendors = true;
        }
        this.dynamicData = new DynamicSearchResult();
        this.dynamicData.query = "select * from MPRDocuments where RevisionId=" + this.MPRRevisionId + " and DocumentTypeid=1"
        this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
          this.MPRRFQDocuments = data;
          this.prepareRfQItems();
          this.prepareVendorMatrix();
        });

        this.getYILTermsAndConditions();

      })

    })
  }

  getYILTermsAndConditions() {
    this.spinner.show();
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select term.TermId,term.TermGroupId,tg.TermGroup,term.BuyerGroupId, term.Terms, CASE WHEN term.DefaultSelect = 0 THEN 'false' ELSE 'true' END AS DefaultSelect from yiltermsandconditions term inner join YILTermsGroup tg on tg.TermGroupId=term.TermGroupId left outer join MPRRevisions mpr on mpr.BuyerGroupId = term.BuyerGroupId or  term.BuyerGroupId is NULL where mpr.RevisionId = " + this.MPRRevisionId + " and term.DeleteFlag = 0 order by TermGroupId, TermId";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.spinner.hide()
      this.YILTermsAndConditions = data;
    })
  }

  openVendorDialog(dialogName: string) {
    this[dialogName] = true;
    this.vendorDetails = new MPRVendorDetail();
    this.newVendorDetails = new VendorMaster();
    this.vendorEmailList = [];
    this.selectedItem = new searchList();
  }

  dialogCancel(dialogName: string, openDialog: string) {
    this[dialogName] = false;
    this[openDialog] = true;
  }

  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, callback?: () => any): void {
    this.formName = formName;
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "venderid")
      this.dynamicData.searchCondition += " OR VendorCode" + " like '%" + searchTxt + "%' ";
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
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
        this.searchItems.push(value);
      });

      if (callback)
        callback();
    });
  }
  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    if (this.formName == "PoFilterParams") {
      this.PoFilterParams.VendorId = item.code;
      this.PoFilterParams.VendorName = item.name;
    }
    else {
      this.vendorEmailList = [];
      this.newVendorDetails = new VendorMaster();
      var addvendor = true;
      if (this.rfqQuoteModel.length > 0) {
        for (var i = 0; i < this.rfqQuoteModel.length; i++) {
          if ((this.vendorDetailsArray.filter(li => li.Vendorid == item.code).length > 0) || (this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == item.code).length > 0) || ((this.rfqQuoteModel[i].manualvendorDetails.filter(li => li.VendorId == item.code)).length > 0)) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'vendor already exist' });
            this.vendorEmailList = [];
            this.newVendorDetails.Emailid = "";
            addvendor = false;
            return false;
          }
        }

        if (addvendor) {
          this.showList = false;
          if (item.updateColumns && item.updateColumns != "NULL") {
            this.vendorEmailList = item.updateColumns.split(",");
            this.newVendorDetails.Emailid = this.vendorEmailList[0];
          }
          this.newVendorDetails.Vendorid = item.code;
          this.newVendor.controls['ContactNo'].clearValidators();
          this.newVendor.controls['VendorName'].clearValidators();
          this.newVendor.controls['ContactNo'].updateValueAndValidity();
          this.newVendor.controls['VendorName'].updateValueAndValidity();
          this.vendorDetails.Vendorid = item.code;
          this.vendorDetails.VendorName = item.name;
        }

      }
      else {
        this.showList = false;
        if (item.updateColumns && item.updateColumns != "NULL") {
          this.vendorEmailList = item.updateColumns.split(",");
          this.newVendorDetails.Emailid = this.vendorEmailList[0];
        }
        this.newVendorDetails.Vendorid = item.code;
        this.newVendor.controls['ContactNo'].clearValidators();
        this.newVendor.controls['VendorName'].clearValidators();
        this.newVendor.controls['ContactNo'].updateValueAndValidity();
        this.newVendor.controls['VendorName'].updateValueAndValidity();
        this.vendorDetails.Vendorid = item.code;
        this.vendorDetails.VendorName = item.name;
      }
    }
  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }

  addEmail() {
    if (this.newVendorDetails.Emailid) {
      var index = this.vendorEmailList.indexOf(this.newVendorDetails.Emailid);
      if (index > -1) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Vendor Email already addedd' });
      }
      else {
        if (this.ValidateEmail())
          this.vendorEmailList.push(this.newVendorDetails.Emailid);
      }
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Email id' });
    }
    //this.newVendorDetails.Emailid = "";
  }

  removeVendorEmail(email: string) {
    var index = this.vendorEmailList.indexOf(email);
    if (index > -1)
      this.vendorEmailList.splice(index, 1);
  }

  //vendor submit
  onVendorSubmit(dialogName: string, type: string) {
    if (type == "vendorDetails") {
      this.vendorSubmitted = true;
      if (this.newVendor.invalid) {
        return;
      }
      else {
        if (this.vendorEmailList.length == 0) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Click add  button to add mails.' });
          return;
        }
        this.newVendorDetails.Emailid = this.vendorEmailList.toString();
        this.newVendorDetails.UpdatedBy = this.employee.EmployeeNo;
        this.spinner.show();
        this.MprService.addNewVendor(this.newVendorDetails).subscribe(data => {
          this.spinner.hide();
          if (data) {
            this.vendorSubmitted = false;
            this.vendorDetailsArray = [];
            this.vendorDetails.Vendorid = data;
            if (this.newVendorDetails.VendorName)
              this.vendorDetails.VendorName = this.newVendorDetails.VendorName;
            this.vendorDetailsArray.push(this.vendorDetails);
            this.vendorDetailsArray.forEach((el) => { el.UpdatedBy = this.employee.EmployeeNo; })
            this.MprService.updateMPRVendor(this.vendorDetailsArray, this.MPRRevisionId).subscribe(data => {
              if (data) {
                this.dynamicData = new DynamicSearchResult();
                this.dynamicData.query = " select * from MPRVendorDetails Where RevisionId=" + this.MPRRevisionId + "";
                this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
                  this.vendorDetailsArray = data;
                });
                //this.vendorDetailsArray = data;
                this[dialogName] = false;
                this.preapreManualRfqlist();
              }
            });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed to add try again' });
          }
        });

      }
    }
  }

  //pepare  Suggested vendors
  prepareRfQItems() {
    if (this.totalRfqItems.length > 0) {
      for (var i = 0; i < this.totalRfqItems.length; i++) {
        var res = this.rfqQuoteModel.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
        if (res.length == 0) {
          var rfqQuoteItems = new rfqQuoteModel();
          rfqQuoteItems.MPRItemDetailsid = this.totalRfqItems[i].MPRItemDetailsid;
          rfqQuoteItems.ItemId = this.totalRfqItems[i].ItemId;
          rfqQuoteItems.ItemName = this.totalRfqItems[i].ItemName;
          rfqQuoteItems.ItemDescription = this.totalRfqItems[i].ItemDescription;
          rfqQuoteItems.TargetSpend = this.totalRfqItems[i].TargetSpend;
          rfqQuoteItems.MprQuantity = this.totalRfqItems[i].MprQuantity;
          rfqQuoteItems.QuotationQty = this.totalRfqItems[i].QuotationQty;//rfqitems
          rfqQuoteItems.UnitPrice = this.totalRfqItems[i].UnitPrice;//rfqitemsinfo
          rfqQuoteItems.vendorQuoteQty = this.totalRfqItems[i].vendorQuoteQty;//rfqitemsinfo
          rfqQuoteItems.Discount = this.totalRfqItems[i].Discount;//rfqitemsinfo
          rfqQuoteItems.PaymentTermCode = this.totalRfqItems[i].PaymentTermCode;//rfqrevision
          rfqQuoteItems.RFQNo = this.totalRfqItems[i].RFQNo;//rfqitemsinfo
          rfqQuoteItems.RateContract = this.totalRfqItems[i].RateContract;//rfqitemsinfo
          if (this.mprVendors) {
            rfqQuoteItems.manualvendorDetails = this.totalRfqItems.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
          }
          else {
            rfqQuoteItems.suggestedVendorDetails = this.totalRfqItems.filter(li => li.MPRItemDetailsid == this.totalRfqItems[i].MPRItemDetailsid);
            rfqQuoteItems.suggestedVendorDetails = rfqQuoteItems.suggestedVendorDetails.filter(li => li.VendorId != null)
            //rfqQuoteItems.suggestedVendorDetails = rfqQuoteItems.suggestedVendorDetails.slice(0, 3);
          }
          this.rfqQuoteModel.push(rfqQuoteItems);
        }
      }
      this.UniqueVendors = [];
      for (var i = 0; i < this.rfqQuoteModel[0].suggestedVendorDetails.length; i++) {
        this.UniqueVendors.push(this.rfqQuoteModel[0].suggestedVendorDetails[i]);
      }
      this.previousrevisionitems();
    }
  }

  preapreManualRfqlist() {
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {
      if (this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == this.vendorDetails.Vendorid).length > 0) {
        this.rfqQuoteModel[i].manualvendorDetails.push(this.rfqQuoteModel[i].suggestedVendorDetails.filter(li => li.VendorId == this.vendorDetails.Vendorid)[0]);
      }
      else {
        let manualdetails = new Object();
        manualdetails["MPRItemDetailsid"] = this.rfqQuoteModel[i].MPRItemDetailsid;
        manualdetails["MPRRevisionId"] = this.MPRRevisionId;
        manualdetails["ItemId"] = this.rfqQuoteModel[i].ItemId;
        manualdetails["ItemName"] = this.rfqQuoteModel[i].ItemName;
        manualdetails["VendorId"] = this.vendorDetails.Vendorid;
        manualdetails["VendorName"] = this.vendorDetails.VendorName;
        manualdetails["UnitPrice"] = "-";
        manualdetails["vendorQuoteQty"] = "-";
        manualdetails["Discount"] = "-";
        manualdetails["PaymentTermCode"] = "-"

        this.rfqQuoteModel[i].manualvendorDetails.push(manualdetails)
      }
    }
  }

  selectVendorList(event: any, itemsIndex: number, vendorIndex: number, id: string, vendor: any, checked: boolean) {
    vendor["VendorVisibility"] = true;
    //vendor["sendemail"] = true;
    var qty = (<HTMLInputElement>document.getElementById(id + itemsIndex + "" + vendorIndex)).value;
    if (id == "SQty")
      this.rfqQuoteModel[itemsIndex].suggestedVendorDetails[vendorIndex].QuotationQty = qty;
    if (id == "MQty")
      this.rfqQuoteModel[itemsIndex].manualvendorDetails[vendorIndex].QuotationQty = qty;
    if (id == "RQty")
      this.rfqQuoteModel[itemsIndex].repeatOrdervendorDetails[vendorIndex].QuotationQty = qty;
    if (checked) {
      var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
      if (event.currentTarget.checked) {
        //(<HTMLInputElement>document.getElementById("vis" + itemsIndex + vendorIndex)).disabled = false;
        //(<HTMLInputElement>document.getElementById("mail" + itemsIndex + vendorIndex)).disabled = false;
        //(<HTMLInputElement>document.getElementById("doc" + itemsIndex + vendorIndex)).disabled = false;
        this.selectedVendorList.push(vendor);
      }
      else {
        this.selectedVendorList.splice(index, 1);
        //(<HTMLInputElement>document.getElementById("vis" + itemsIndex + vendorIndex)).disabled = true;
        //(<HTMLInputElement>document.getElementById("mail" + itemsIndex + vendorIndex)).disabled = true;
        //(<HTMLInputElement>document.getElementById("doc" + itemsIndex + vendorIndex)).disabled = true;
        //(<HTMLInputElement>document.getElementById("vis" + itemsIndex + vendorIndex)).checked = false;
        //(<HTMLInputElement>document.getElementById("mail" + itemsIndex + vendorIndex)).checked = false;
        //(<HTMLInputElement>document.getElementById("doc" + itemsIndex + vendorIndex)).checked = false;
      }
    }
  }

  //select unselect All vendors
  selectAllvendors(event: any, vendorId: any, MPRItemDetailsid: any) {

    // var index1 = this.selectedVendorList.findIndex(li => (li.VendorId == vendorId) && (li.MPRItemDetailsid == MPRItemDetailsid));
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {
      this.rfqQuoteModel[i].suggestedVendorDetails.forEach((vendor, index) => {
        vendor["VendorVisibility"] = true;
        //vendor["sendemail"] = true;
        var index1 = this.selectedVendorList.findIndex(li => (li.VendorId == vendorId) && (li.MPRItemDetailsid == vendor.MPRItemDetailsid));
        if (event.currentTarget.checked && vendor.VendorId == vendorId && (<HTMLInputElement>document.getElementById("SVendor" + i + index))) {
          var qty = (<HTMLInputElement>document.getElementById("SQty" + i + "" + index)).value;
          this.rfqQuoteModel[i].suggestedVendorDetails[index].QuotationQty = qty;
          if (index1 < 0) {
            (<HTMLInputElement>document.getElementById("SVendor" + i + index)).checked = true;
            this.selectedVendorList.push(vendor);
          }
        }
        else {
          if (event.currentTarget.checked == false && vendor.VendorId == vendorId && index1 >= 0 && (<HTMLInputElement>document.getElementById("SVendor" + i + index))) {
            this.selectedVendorList.splice(index1, 1);
            (<HTMLInputElement>document.getElementById("SVendor" + i + index)).checked = false;
          }
        }
      });
      this.rfqQuoteModel[i].manualvendorDetails.forEach((vendor, index) => {
        vendor["VendorVisibility"] = true;
        //vendor["sendemail"] = true;
        var index1 = this.selectedVendorList.findIndex(li => (li.VendorId == vendorId) && (li.MPRItemDetailsid == vendor.MPRItemDetailsid));
        if (event.currentTarget.checked && vendor.VendorId == vendorId && (<HTMLInputElement>document.getElementById("MVendor" + i + index))) {
          var qty = (<HTMLInputElement>document.getElementById("MQty" + i + "" + index)).value;
          this.rfqQuoteModel[i].manualvendorDetails[index].QuotationQty = qty;
          if (index1 < 0) {
            (<HTMLInputElement>document.getElementById("MVendor" + i + index)).checked = true;
            this.selectedVendorList.push(vendor);
          }
        }
        else {
          if (event.currentTarget.checked == false && vendor.VendorId == vendorId && index1 >= 0 && (<HTMLInputElement>document.getElementById("MVendor" + i + index))) {
            this.selectedVendorList.splice(index1, 1);
            (<HTMLInputElement>document.getElementById("MVendor" + i + index)).checked = false;
          }
        }
      })
      this.rfqQuoteModel[i].repeatOrdervendorDetails.forEach((vendor, index) => {
        vendor["VendorVisibility"] = true;
        //vendor["sendemail"] = true;
        var index1 = this.selectedVendorList.findIndex(li => (li.VendorId == vendorId) && (li.MPRItemDetailsid == vendor.MPRItemDetailsid));
        if (event.currentTarget.checked && vendor.VendorId == vendorId && (<HTMLInputElement>document.getElementById("RVendor" + i + index))) {
          var qty = (<HTMLInputElement>document.getElementById("RQty" + i + "" + index)).value;
          this.rfqQuoteModel[i].repeatOrdervendorDetails[index].QuotationQty = qty;
          if (index1 < 0) {
            (<HTMLInputElement>document.getElementById("RVendor" + i + index)).checked = true;
            this.selectedVendorList.push(vendor);
          }
        }
        else {
          if (event.currentTarget.checked == false && vendor.VendorId == vendorId && index1 >= 0 && (<HTMLInputElement>document.getElementById("RVendor" + i + index))) {
            this.selectedVendorList.splice(index1, 1);
            (<HTMLInputElement>document.getElementById("RVendor" + i + index)).checked = false;
          }
        }
      });
    }


  }

  //select mail and vendor visibility  funcationality
  selectVsblltyandEmail(vendor: any) {
    var index = this.selectedVendorList.findIndex(x => x.VendorId == vendor.VendorId);
    if (index >= 0) {
      if ((<HTMLInputElement>document.getElementById("vis" + vendor.VendorId)).checked == true)
        this.selectedVendorList[index].VendorVisibility = true;
      else
        this.selectedVendorList[index].VendorVisibility = false;
      //if ((<HTMLInputElement>document.getElementById("mail" + vendor.VendorId)).checked == true)
      //  this.selectedVendorList[index].sendemail = true;
      //else
      //  this.selectedVendorList[index].sendemail = false;
    }
  }
  selectDoc(index: any, mprdoc: any, vendorid: any) {
    var index1 = this.selectedDocList.findIndex(x => x.MprDocId == mprdoc.MprDocId && x.VendorId == mprdoc.VendorId);
    if ((<HTMLInputElement>document.getElementById("doc" + index + mprdoc.MprDocId)).checked == true) {
      this.mprDocument = new MPRDocument();
      this.mprDocument.MprDocId = mprdoc.MprDocId;
      this.mprDocument.Path = mprdoc.Path;
      this.mprDocument.DocumentName = mprdoc.DocumentName;
      this.mprDocument.VendorId = vendorid;
      this.mprDocument.ItemDetailsId = mprdoc.ItemDetailsId;
      this.mprDocument.DocumentTypeid = mprdoc.DocumentTypeid;
      this.selectedDocList.push(this.mprDocument);
    }
    else {
      this.selectedDocList.splice(index1, 1);
    }
  }
  //Conforamtion Data
  prepareVendorMatrix() {
    this.cols = [];
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {
      this.rfqQuoteModel[i].suggestedVendorDetails.forEach(vendor => {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {
          var object = { ItemId: vendor.ItemId, VendorName: vendor.VendorName, VendorId: vendor.VendorId, RFQType: vendor.RFQType, MPRItemDetailsid: vendor.MPRItemDetailsid };
          this.cols.push(object);
        }
      });
      this.rfqQuoteModel[i].manualvendorDetails.forEach(vendor => {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {

          var object = { ItemId: vendor.ItemId, VendorName: vendor.VendorName, VendorId: vendor.VendorId, RFQType: vendor.RFQType, MPRItemDetailsid: vendor.MPRItemDetailsid };
          this.cols.push(object);
        }
      })
      this.rfqQuoteModel[i].repeatOrdervendorDetails.forEach(vendor => {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {

          var object = { ItemId: vendor.ItemId, VendorName: vendor.VendorName, VendorId: vendor.VendorId, RFQType: vendor.RFQType, MPRItemDetailsid: vendor.MPRItemDetailsid };
          this.cols.push(object);
        }
      })
    }
    this.DocListVendors = Array.from(this.selectedVendorList.reduce((m, t) => m.set(t.VendorId, t), new Map()).values());
  }

  bindCheckeMark(vendor: any, MPRItemDetailsid: number) {
    return this.selectedVendorList.filter(li => (li.VendorId == vendor.VendorId) && (li.MPRItemDetailsid == MPRItemDetailsid)).length > 0 ? true : false;
  }

  openrevisionDialog() {
    this.showConformationDialog = false;
    //this.showRevisionsDialog = true;
    //if (this.selectedVendorList.filter(li => li.RFQType == null).length > 0)
    //  this.showTerms = true;
    //else
    //  this.showTerms = false;

    this.onVendorQuoteUpdate();
  }

  openConformDialog() {
    if (this.selectedVendorList.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select atlest one vendor' });
      return;
    }
    this.prepareVendorMatrix();
    this.showConformationDialog = true;

  }
  termChange(event: any, index: number) {
    this.YILTermsAndConditions[index].DefaultSelect = event.target.checked
  }

  onVendorQuoteUpdate() {
    var date = new Date();
    if (this.RFQRevisionData.RfqValidDate)
      date.setDate(date.getDate() + parseInt(this.RFQRevisionData.RfqValidDate.toString()));
    else
      date.setDate(date.getDate() + this.constants.rfqValidDays);
    this.selectedVendorList.forEach(item => {
      item.CreatedBy = this.employee.EmployeeNo;
      item.CreatedDate = new Date();
      item.RfqValidDate = new Date(date);
      item.PackingForwading = this.RFQRevisionData.PackingForwading;
      item.ExciseDuty = this.RFQRevisionData.ExciseDuty;
      item.salesTax = this.RFQRevisionData.salesTax; 
      item.freight = this.RFQRevisionData.freight;
      item.Insurance = this.RFQRevisionData.Insurance;
      item.CustomsDuty = this.RFQRevisionData.CustomsDuty;
      item.PaymentTermDays = this.RFQRevisionData.PaymentTermDays;
      item.PaymentTermRemarks = this.RFQRevisionData.PaymentTermRemarks;
      item.BankGuarantee = this.RFQRevisionData.BankGuarantee;
      item.DeliveryMinWeeks = this.RFQRevisionData.DeliveryMinWeeks;
      item.DeliveryMaxWeeks = this.RFQRevisionData.DeliveryMaxWeeks;
      item.Remarks = this.RFQRevisionData.Remarks;
      //item.DocList = this.selectedDocList.filter(li => li.VendorId == item.VendorId);
    });
    this.YILTermsAndConditions.forEach((el) => { el.CreatedBy = this.employee.EmployeeNo; })
    this.spinner.show();
    this.RfqService.updateVendorQuotes(this.selectedVendorList, this.YILTermsAndConditions, this.selectedDocList).subscribe(data => {
      if (data) {
        this.spinner.hide();
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Updated sucessfully' });
        this.showRevisionsDialog = false;
        this.router.navigate(["/SCM/RFQComparision", this.MPRRevisionId]);
      }
    })
  }

  showVendorClick() {
    this.newVendorDetails.Vendorid = 0;
    this.newVendor.controls['VendorName'].setValidators([Validators.required]);
    this.newVendor.controls['ContactNo'].setValidators([Validators.required]);
  }

  showAssignRoDialog(rindex: number, item: any) {
    this.assignRoDialog = true;
    this.MPRItemDetailsid = item.MPRItemDetailsid;
    this.PoFilterParams.Materialdescription = item.ItemId;
    this.selectedRrepeatOrdervendorDetails = [];
    this.rfqIndex = rindex;
    if (this.repeatOrdervendorDetailsList.length == 0) {
      this.bindRepeatOrderList();
    }
  }

  bindRepeatOrderList() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select * from RepeatOrdersView where RFQType in ('Repeat Order','Quote')";
    if (this.PoFilterParams.PONO)
      this.dynamicData.query += "  and PONO ='" + this.PoFilterParams.PONO + "'";
    if (this.PoFilterParams.RFQNo)
      this.dynamicData.query += " and RFQNo ='" + this.PoFilterParams.RFQNo + "'";
    if (this.PoFilterParams.Materialdescription)
      this.dynamicData.query += " and (Materialdescription = '" + this.PoFilterParams.Materialdescription + "' OR ItemId='" + this.PoFilterParams.Materialdescription + "')";
    if (this.PoFilterParams.VendorName)
      this.dynamicData.query += " and VendorName ='" + this.PoFilterParams.VendorName + "'";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.repeatOrdervendorDetailsList = data;
    })
  }

  assignRepeatorders() {
    this.selectedRrepeatOrdervendorDetails.forEach((value: any) => {
      value.MPRRevisionId = this.MPRRevisionId;
      value.MPRItemDetailsid = this.MPRItemDetailsid;
    })
    this.rfqQuoteModel[this.rfqIndex].repeatOrdervendorDetails = this.selectedRrepeatOrdervendorDetails;
    this.assignRoDialog = false;
    this.rfqQuoteModel[this.rfqIndex].suggestedVendorDetails.forEach((item, rowIndex: number) => {
      (<HTMLInputElement>document.getElementById("vendor" + this.rfqIndex + rowIndex)).disabled = true;
      (<HTMLInputElement>document.getElementById("vendor" + this.rfqIndex + rowIndex)).checked = false;
      var index = this.selectedVendorList.findIndex(li => (li.VendorId == item.VendorId) && (li.MPRItemDetailsid == this.MPRItemDetailsid));
      this.selectedVendorList.splice(index, 1);
    });
    this.rfqQuoteModel[this.rfqIndex].manualvendorDetails.forEach((item, rowIndex: number) => {
      (<HTMLInputElement>document.getElementById("vendor" + this.rfqIndex + rowIndex)).disabled = true;
      (<HTMLInputElement>document.getElementById("vendor" + this.rfqIndex + rowIndex)).checked = false;
      var index = this.selectedVendorList.findIndex(li => (li.VendorId == item.VendorId) && (li.MPRItemDetailsid == this.MPRItemDetailsid));
      this.selectedVendorList.splice(index, 1);
    })

  }
  deAssignPo(index: number) {
    this.rfqQuoteModel[index].repeatOrdervendorDetails = [];
    this.rfqQuoteModel[index].suggestedVendorDetails.forEach((item, rowIndex: number) => {
      (<HTMLInputElement>document.getElementById("vendor" + index + rowIndex)).disabled = false;
      var index1 = this.selectedVendorList.findIndex(li => (li.VendorId == item.VendorId) && (li.MPRItemDetailsid == this.MPRItemDetailsid));
      this.selectedVendorList.splice(index1, 1);
    });
    this.rfqQuoteModel[index].manualvendorDetails.forEach((item, rowIndex: number) => {
      (<HTMLInputElement>document.getElementById("vendor" + index + rowIndex)).disabled = false;
      var index2 = this.selectedVendorList.findIndex(li => (li.VendorId == item.VendorId) && (li.MPRItemDetailsid == this.MPRItemDetailsid));
      this.selectedVendorList.splice(index2, 1);
    })
  }

  //function to validate email
  ValidateEmail() {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.newVendorDetails.Emailid)) {
      return true;
    }
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'You have entered an invalid email address!' });
    return false;
  }

  scrollToView(id) {
    var elmnt = document.getElementById(id);
    elmnt.scrollIntoView(false);
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }

  uploadFileDialog() {
    this.showDocumentUpload = true;
    this.selectedDocVendors = [];
    //this.itemdetailId = itemdetailId;
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var revisionId = this.MPRRevisionId.toString();
      formData.append(revisionId, file, file.name);
      this.MprService.uploadFile(formData).subscribe(data => {
        //upload in cloud server
        this.MprService.InsertDocument(formData).subscribe(data => {
        });

        //this.mprDocument.ItemDetailsId = this.itemdetailId
        this.path = data;
        this.docName = file.name;
      });
    }
  }

  //to close upload dialog
  onDocumentSubmit() {
    if (this.path == "") {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Choose file' });
      return;
    }
    if (this.selectedDocVendors.length == 0) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor' });
      return;
    }
    this.showDocumentUpload = false;
    this.selectedDocVendors.forEach(item => {
      this.mprDocument = new MPRDocument();
      this.mprDocument.Path = this.path;
      this.mprDocument.DocumentName = this.docName;
      this.mprDocument.VendorId = item.VendorId;
      this.mprDocument.ItemDetailsId = null;
      this.mprDocument.DocumentTypeid = 5;
      this.MPRRFQDocuments.push(this.mprDocument);
      this.selectedDocList.push(this.mprDocument);
    })
  }
  //get vendor name
  getVendorName(vendorId) {
    return this.selectedVendorList.filter(li => (li.VendorId == vendorId))[0].VendorName;
  }

  stringGen() {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  navigateTotermsMaster() {
    this.router.navigate([]).then(result => {
      window.open('/SCM/TermsAndConditions/', '_blank');
    });
  }

  Showmappingitem() {
    this.EditDialog = true;
  }

  Cancel() {
    this.EditDialog = false;
    this.Recreateitems = false;
  }

  previousrevisionitems() {
    var data = this.totalRfqItems
    for (var i = 0; i < this.totalRfqItems.length; i++) {
      this.ItemDetailsid.push(this.totalRfqItems[i].MPRItemDetailsid)
    }
    
    this.MprService.previousrevisionitems(this.ItemDetailsid).subscribe(data => {
      this.PreviousDetails = data;
      this.prepareColsData();
      for (var i = 0; i < this.rfqQuoteModel.length; i++) {
        for (var j = 0; j < this.PreviousDetails.length; j++) {
          if (this.rfqQuoteModel[i].MPRItemDetailsid == this.PreviousDetails[j].previousitemdetails) {
            this.MappingItems = new mappingitems();
            this.MappingItems.itemrevision = this.PreviousDetails[j].itemrevision;
            this.MappingItems.rfqRevisionId = this.PreviousDetails[j].rfqRevisionId;
            this.MappingItems.previousitemdetails = this.PreviousDetails[j].previousitemdetails;
            this.MappingItems.vendorname = this.PreviousDetails[j].vendorname;
            this.MappingItems.VendorCode = this.PreviousDetails[j].VendorCode;
            this.MappingItems.city = this.PreviousDetails[j].city;
            this.MappingItems.Discount = this.PreviousDetails[j].Discount;
            this.MappingItems.DiscountPercentage = this.PreviousDetails[j].DiscountPercentage;
            this.MappingItems.RFQSplitItemId = this.PreviousDetails[j].RFQSplitItemId;
            this.MappingItems.RfqMasterId = this.PreviousDetails[j].RfqMastefrepeatOrdervendorDetailsrId;
            this.MappingItems.rfqRevisionId = this.PreviousDetails[j].rfqRevisionId;
            this.MappingItems.RFQNo = this.PreviousDetails[j].RFQNo;
            this.MappingItems.RFQItemsId = this.PreviousDetails[j].RFQItemsId;
            this.MappingItems.itemdescription = this.PreviousDetails[j].itemdescription;
            this.MappingItems.mprquantiy = this.PreviousDetails[j].mprquantiy;
            this.MappingItems.UnitPrice = this.PreviousDetails[j].UnitPrice;
            this.MappingItems.Itemdetailsid = this.PreviousDetails[j].Itemdetailsid;
            this.MappingItems.Duplicateitemid = this.PreviousDetails[j].Duplicateitemid;
            this.MappingItems.Newitemrevision = this.PreviousDetails[j].Newitemrevision;
            this.rfqQuoteModel[i].mappingdoneitems.push(this.MappingItems);
          }
          //this.rfqQuoteModel[i].mappingdoneitems.push(this.PreviousDetails.filter(x => x.previousitemdetails == this.rfqQuoteModel[i].MPRItemDetailsid));
          //this.rfqQuoteModel[i].mappingdoneitems.push(this.PreviousDetails.filter(x => x.previousitemdetails == this.rfqQuoteModel[i].suggestedVendorDetails[j].MPRItemDetailsid));
        }
        //this.rfqQuoteModel[i].mappingdoneitems.push(this.PreviousDetails.filter(x => x.previousitemdetails == this.rfqQuoteModel[i].MPRItemDetailsid));
      }
      //for (var i = 0; i < this.rfqQuoteModel.length; i++) {
      //  this.rfqQuoteModel[i].mappingdoneitems.push(this.PreviousDetails.filter(x => x.previousitemdetails == this.rfqQuoteModel[i].MPRItemDetailsid));
      //}
      for (var i = 0; i < this.rfqQuoteModel.length; i++) {
        if (this.rfqQuoteModel[i].mappingdoneitems.length > 0) {
          for (var j = 0; j < this.rfqQuoteModel[i].mappingdoneitems.length; j++) {
            if (this.rfqQuoteModel[i].suggestedVendorDetails[j]['MPRItemDetailsid'] == this.rfqQuoteModel[i].mappingdoneitems[j].previousitemdetails && this.rfqQuoteModel[i].mappingdoneitems[j].Duplicateitemid != null) {
              this.rfqQuoteModel[i].suggestedVendorDetails[j]['VendorId'] = null
            }
          }
        }
      }
      let data1 = new Array();
      for (var i = 0; i < this.vendorcols.length; i++) {
          //var itemdata = new mappingitems();
        data1 = this.PreviousDetails.filter(x => x.VendorCode == this.vendorcols[i].VendorCode);
        for (var j = 0; j < data1.length; j++) {
          this.MappingItems = new mappingitems();
          this.MappingItems.itemrevision = data1[j].itemrevision;
          this.MappingItems.rfqRevisionId = data1[j].rfqRevisionId;
          this.MappingItems.previousitemdetails = data1[j].previousitemdetails;
          this.MappingItems.vendorname = data1[j].vendorname;
          this.MappingItems.VendorCode = data1[j].VendorCode;
          this.MappingItems.city = data1[j].city;
          this.MappingItems.Discount = data1[j].Discount;
          this.MappingItems.DiscountPercentage = data1[j].DiscountPercentage;
          this.MappingItems.RFQSplitItemId = data1[j].RFQSplitItemId;
          this.MappingItems.RfqMasterId = data1[j].RfqMastefrepeatOrdervendorDetailsrId;
          this.MappingItems.rfqRevisionId = data1[j].rfqRevisionId;
          this.MappingItems.RFQNo = data1[j].RFQNo;
          this.MappingItems.RFQItemsId = data1[j].RFQItemsId;
          this.MappingItems.itemdescription = data1[j].itemdescription;
          this.MappingItems.mprquantiy = data1[j].mprquantiy;
          this.MappingItems.UnitPrice = data1[j].UnitPrice;
          this.MappingItems.Itemdetailsid = data1[j].Itemdetailsid;
          this.MappingItems.Duplicateitemid = data1[j].Duplicateitemid;
          this.MappingItems.Newitemrevision = data1[j].Newitemrevision;
          this.rfqQuoteModel[j].mappeditems.push(this.MappingItems);
        }
      }
    })
  }
  selectVendor1List(data: any, event: any) {
    if (event.currentTarget.checked) {
      console.log("dada", data)
    }
    else {

    }
  }
  selectAllitems(data1: any, event: any) {
    if (event.currentTarget.checked) {
      console.log("dadada", data1)
    }
    else {

    }
  }
  UniquevendorDetailsArray() {
    var vendor;
    let adat = new Array();
    let vendordetails = new Array();
    //this.UniqueVendors.push(this.rfqQuoteModel[0].suggestedVendorDetails)
    console.log("this.UniqueVendors", this.UniqueVendors)
    //from get rfqitems
    // adat = this.UniqueVendors;

    //for (var i = 0; i < adat.length; i++) {
    //    if (i == 0) {
    //        vendor = adat[i]['VendorName']
    //        vendordetails.push(adat[i])
    //    }
    //    else {
    //        if (vendor != adat[i]['VendorName']) {
    //            vendordetails.push(adat[i])
    //        }
    //    } 

    //}
    return vendordetails;
  }
  prepareColsData() {
    this.vendorcols = [];
    this.PreviousDetails.forEach(vendor => {
      if (this.vendorcols.filter(li => li.VendorCode == vendor.VendorCode).length == 0) {
        this.vendorcols.push(vendor);
      }
    });
    this.currenitem = [];
    for (var i = 0; i < this.rfqQuoteModel.length; i++) {

    }
    //this.currenitem.push(this.rfqQuoteModel[0]['suggestedVendorDetails'])
  }
  selectVendoritemList(data: any, event: any) {
    //this.recreatetype = type;
    if (event.currentTarget.checked) {
      this.selecteditems.push(data);
    } 
    else {
      for (var i = 0; i < this.selecteditems.length; i++) {
        var index = this.selecteditems.findIndex(x => x.RFQItemsId == data.RFQItemsId)
        if (index >= 0) {
          this.selecteditems.splice(index, 1)
        }
      }
    }
  }
  selectAllVendoritemList(vendor: any, event: any, colind: any) {
    //this.recreatetype = type;
    let index = []
    if (event.currentTarget.checked) {
      index = this.PreviousDetails.filter(x => x.VendorCode == vendor.VendorCode && x.Duplicateitemid == null);
      for (var i = 0; i < index.length; i++) {
        (<HTMLInputElement>document.getElementById("item" + index[i].RFQItemsId)).checked = true;
        if (this.selecteditems.filter(x => x.RFQItemsId != index[i].RFQItemsId)) {
          this.selecteditems.push(index[i])
        }
        
      }
    }
    else {
      let deselect = [];
      deselect = this.selecteditems.filter(x => x.VendorCode == vendor.VendorCode);
      deselect.forEach((item) => {
        var index1 = this.selecteditems.findIndex(li => li.VendorCode == item.VendorCode);
          (<HTMLInputElement>document.getElementById("item" + item.RFQItemsId)).checked = false;
        this.selecteditems.splice(index1, 1)
      })
    }
  }
  Insertmappingitem() {
    this.MprService.Insertmappingitem(this.selecteditems).subscribe(data => {
      this.mappedboolean = false;
      this.rfqitemsid = data;
      this.EditDialog = false;
      window.location.reload();
      //this.rfqitemsid.forEach(item => {
      //  this.PreviousDetails.filter(x => x.RFQItemsId == item.rfqitemid);
      //  (<HTMLInputElement>document.getElementById("item" + item.rfqitemid)).disabled = true;

      //});
    })
  }

  Showrecreateitem() {
    this.Recreateitems = true;
  }
  //RecreateItem() {
  //  if (this.selecteditems.length == 0) {
  //    for (var i = 0; i < this.PreviousDetails.length; i++) {
  //      this.RfqService.RecreateNewRfqRevision(this.PreviousDetails[i]['rfqRevisionId'],this.recreatetype).subscribe(data => {

  //      })
  //    }
  //  }
  //  else {
  //    for (var i = 0; i < this.selecteditems.length; i++) {
  //      this.RfqService.RecreateNewRfqRevision(this.selecteditems[i]['rfqRevisionId'],this.recreatetype).subscribe(data => {

  //      })
  //    }
  //  }
  //}
  ItemDocumments() {
    this.showConformationDialog = true;
  }
  ItemUnmapping(data: any) {
    this.MprService.Unmappingitem(data).subscribe(data => {
      window.location.reload();
    })
  }
}


