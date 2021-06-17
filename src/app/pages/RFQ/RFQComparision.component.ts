import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RfqService } from 'src/app/services/rfq.service ';
import { MprService } from 'src/app/services/mpr.service';
import { constants } from 'src/app/Models/MPRConstants';
import { rfqQuoteModel, VendorDetails, rfqTerms } from 'src/app/Models/rfq';
import { Employee, MPRItemInfoes, DynamicSearchResult,mprRevision } from 'src/app/Models/mpr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-RFQComparision',
  templateUrl: './RFQComparision.component.html',
})

export class RFQComparisionComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  constructor(public RfqService: RfqService, public MprService: MprService, public constants: constants, private route: ActivatedRoute, private router: Router, private messageService: MessageService,private formBuilder: FormBuilder,private spinner: NgxSpinnerService) { }

  //variable Declarations
  public employee: Employee;
  public MPRRevisionId: number;
  public selectedVendorList: Array<any> = [];
  public RfqCompareItems: Array<any> = [];
  public rfqTermsList: Array<any> = [];
  public rfqQuoteModel: Array<rfqQuoteModel> = [];
  public vendorDetails: VendorDetails;
  public cols: any[];
  public status: string;
  public statusList: Array<any> = [];
  public termCols: Array<rfqTerms> = []
  public tp: number = 0;
  public PreviousPrices: MPRItemInfoes;
  public showPODialog;ShowMV_Justification;YetToApproved: boolean = false;
  public poRowIndex: number;
  public rfqrevisionsList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();
  public MprMVJustification: any;
  public MPRMvJustificationForm: FormGroup;
  public mprRevisionModel:mprRevision;
  

  //page load event
  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");

    this.PreviousPrices = new MPRItemInfoes();
    this.mprRevisionModel = new mprRevision();
    this.route.params.subscribe(params => {
      if (params["MPRRevisionId"]) {
        this.MPRRevisionId = params["MPRRevisionId"];
        this.getRFQCompareItemsById();
      }
    });
    this.MPRMvJustificationForm = this.formBuilder.group({
    
      MVJustificationId: ['', [Validators.required]]
      
    });
  }
  getRFQCompareItemsById() {
    this.spinner.show();
    this.RfqService.getRFQCompareItems(this.MPRRevisionId).subscribe(data => {
      this.RfqCompareItems = data["CompareTable"];
      this.rfqTermsList = data["RfqtermsTable"];
      this.loadMPRMVJustification();
      this.prepareRfQItems();
      if (this.rfqTermsList.length > 0)
        this.prepareTermNames();
      this.getRfqrevisionList();
      this.ShowMVJustification();
      this.spinner.hide();
    
    })
   
    
  }

  //ger rfqrevision list
  getRfqrevisionList() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "select rm.MPRRevisionId, rm.RfqMasterId,rm.RFQNo,rm.RFQUniqueNo,rm.VendorId,rfqr.RevisionNo,rfqr.rfqRevisionId,rfqr.ActiveRevision from RFQMaster rm inner join RFQRevisions_N rfqr on rfqr.rfqMasterId=rm.RfqMasterId where ActiveRevision=1 and  rm.MPRRevisionId=" + this.MPRRevisionId + "";
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.rfqrevisionsList = data;
    });
  }

  prepareRfQItems() {
    this.prepareColsData();
    this.prepareTermNames();
    //added active revision 
    for (var i = 0; i < this.RfqCompareItems.length; i++) {
      if (this.RfqCompareItems[i].ActiveRevision) {
        var res = this.rfqQuoteModel.filter(li => li.Itemdetailsid == this.RfqCompareItems[i].Itemdetailsid);
        if (res.length == 0) {
          var rfqQuoteItems = new rfqQuoteModel();
          rfqQuoteItems.RFQSplitItemId = this.RfqCompareItems[i].RFQSplitItemId;
          rfqQuoteItems.MPRItemDetailsid = this.RfqCompareItems[i].MPRItemDetailsid;
          rfqQuoteItems.ItemId = this.RfqCompareItems[i].ItemId;
          rfqQuoteItems.ItemName = this.RfqCompareItems[i].ItemName 
          rfqQuoteItems.Itemdetailsid = this.RfqCompareItems[i].Itemdetailsid;//uniq id
          rfqQuoteItems.PONumber = this.RfqCompareItems[i].PONumber;
          rfqQuoteItems.PODate = this.RfqCompareItems[i].PODate;
          rfqQuoteItems.POPrice = this.RfqCompareItems[i].POPrice;
          rfqQuoteItems.POUnitPrice = this.RfqCompareItems[i].POUnitPrice;
          rfqQuoteItems.PORemarks = this.RfqCompareItems[i].PORemarks;
          rfqQuoteItems.ActiveRevision = this.RfqCompareItems[i].ActiveRevision;//from rfq revision_n 
          rfqQuoteItems.ItemDescription = this.RfqCompareItems[i].ItemDescription;
          rfqQuoteItems.TargetSpend = this.RfqCompareItems[i].TargetSpend;
          rfqQuoteItems.QuotationQty = this.RfqCompareItems[i].QuotationQty;//rfqitems
          rfqQuoteItems.MprQuantity = this.RfqCompareItems[i].MprQuantity;
          rfqQuoteItems.vendorQuoteQty = this.RfqCompareItems[i].vendorQuoteQty;//rfqitemsinfo
          rfqQuoteItems.UnitPrice = parseFloat(this.RfqCompareItems[i].UnitPrice).toFixed(2);//rfqitemsinfo
          rfqQuoteItems.RfqDocStatus = this.RfqCompareItems[i].RfqDocStatus;//rfqdocuments
          rfqQuoteItems.Remarks = this.RfqCompareItems[i].Remarks; //rfqiteminfo
          this.cols.forEach(vendor => {
            this.vendorDetails = new VendorDetails();
            if (this.RfqCompareItems.filter(li => li.VendorId == vendor.VendorId && li.Itemdetailsid == this.RfqCompareItems[i].Itemdetailsid)[0])
              this.vendorDetails = this.RfqCompareItems.filter(li => li.VendorId == vendor.VendorId && li.Itemdetailsid == this.RfqCompareItems[i].Itemdetailsid)[0];
            else {
              this.createEmptyVendor();
            }
            this.discountCalculation(this.vendorDetails);
            
            this.vendorDetails.UnitPrice = parseFloat(this.vendorDetails.UnitPrice).toFixed(2);
            this.vendorDetails.FreightAmount = parseFloat(this.calculateFRAmount(this.vendorDetails).toString()).toFixed(2);
            //this.vendorDetails.FreightAmount = parseFloat(this.vendorDetails.FreightAmount).toFixed(2);
            this.vendorDetails.PFAmount = parseFloat((this.calculatePFamount(this.vendorDetails)).toString()).toFixed(2);
            this.vendorDetails.HandlingAmount = parseFloat(((this.tp) * (vendor.HandlingPercentage / 100)).toString()).toFixed(2);
            this.vendorDetails.ImportFreightAmount = parseFloat(((this.tp + parseFloat(this.vendorDetails.HandlingAmount)) * (vendor.ImportFreightPercentage / 100)).toString()).toFixed(2);
            this.vendorDetails.InsuranceAmount = parseFloat(((this.tp + parseFloat(this.vendorDetails.HandlingAmount) + parseFloat(this.vendorDetails.ImportFreightAmount)) * (vendor.InsurancePercentage / 100)).toString()).toFixed(2);
            this.vendorDetails.DutyAmount = parseFloat(((this.tp + parseFloat(this.vendorDetails.HandlingAmount) + parseFloat(this.vendorDetails.ImportFreightAmount) + parseFloat(this.vendorDetails.InsuranceAmount)) * (vendor.DutyPercentage / 100)).toString()).toFixed(2);
            this.vendorDetails.MaterialTotalPrice = parseFloat((this.calculateItemToatlPriceWOH(this.vendorDetails)).toString()).toFixed(2);
            this.vendorDetails.HandlingChargesTotal = parseFloat((this.calculateItemToatlPriceHC(this.vendorDetails)).toString()).toFixed(2);
            this.vendorDetails.TotalPrice = parseFloat((this.calculateItemToatlPriceWH(this.vendorDetails)).toString()).toFixed(2);
            if (this.vendorDetails.Discount)
              this.vendorDetails.Discount = parseFloat(this.vendorDetails.Discount).toFixed(2);
            rfqQuoteItems.suggestedVendorDetails.push(this.vendorDetails);
            
          });
        
        var ItemListStatus=  rfqQuoteItems.suggestedVendorDetails.filter(li => li.Status != "Approved");
          if(ItemListStatus.length>0)
          this.YetToApproved=true;

          //rfqQuoteItems.suggestedVendorDetails = this.RfqCompareItems.filter(li => li.ItemId == this.RfqCompareItems[i].ItemId);
          rfqQuoteItems.leastPrice = Math.min.apply(Math, rfqQuoteItems.suggestedVendorDetails.filter(li => li.UnitPrice != null).map(function (o) { return o.UnitPrice; }));
          this.rfqQuoteModel.push(rfqQuoteItems);
        }
      }
    }

  }

  prepareTermNames() {
    this.rfqTermsList.forEach(item => {
      var rfqTermObj = new rfqTerms();
      if (this.termCols.filter(li => li.Terms == item.Terms).length == 0) {
        //if (this.termCols.filter(li => li.RFQrevisionId == item.RFQrevisionId).length == 0) {
        rfqTermObj.Terms = item.Terms;
        rfqTermObj.RFQrevisionId = item.RFQrevisionId;
        rfqTermObj.Remarks = item.Remarks;
        rfqTermObj.VendorResponse = item.VendorResponse;
        //rfqTermObj.termsList = this.rfqTermsList.filter(li => li.Terms == item.Terms)
        this.termCols.push(rfqTermObj);
        //}
      }
    });
  }

  getTerm(revisionId, term: rfqTerms) {
    var termRes = this.rfqTermsList.filter(li => li.RFQrevisionId == revisionId && li.Terms == term.Terms)[0];
    if (termRes && termRes.VendorResponse)
      return termRes.VendorResponse;
    else
      return "";
  }
  getRemarks(revisionId, term: rfqTerms) {
    var termRes = this.rfqTermsList.filter(li => li.RFQrevisionId == revisionId && li.Terms == term.Terms)[0];
    if (termRes && termRes.Remarks)
      return termRes.Remarks;
    else
      return "";
  }
  createEmptyVendor() {
    this.vendorDetails.VendorCode = "";
    this.vendorDetails.VendorName = "";
    this.vendorDetails.OldvendorCode = "";
    this.vendorDetails.RFQNo = "";
    this.vendorDetails.MPRRevisionId = "";
    this.vendorDetails.RfqMasterId = "";
    this.vendorDetails.VendorId = null;
    this.vendorDetails.rfqRevisionId = 0;
    this.vendorDetails.RFQValidDate = new Date();
    this.vendorDetails.DeliveryMinWeeks = 0;
    this.vendorDetails.DeliveryMaxWeeks = 0;
    this.vendorDetails.RFQItemsId = 0;
    this.vendorDetails.MPRItemsDetailsId = 0;
    this.vendorDetails.VendorQuoteQty = "";
    this.vendorDetails.UnitPrice = null;
    this.vendorDetails.DiscountPercentage = "";
    this.vendorDetails.Discount = "";
    this.vendorDetails.PaymentTermDays = 0;
    this.vendorDetails.PaymentTermRemarks = "";
    this.vendorDetails.BankGuarantee = "";
    this.vendorDetails.Freight = "";
    this.vendorDetails.Insurance = "";

  }
  //Conforamtion Data
  prepareColsData() {
    this.cols = [];
    this.RfqCompareItems.forEach(vendor => {
      if (vendor.ActiveRevision) {
        if (this.cols.filter(li => li.VendorId == vendor.VendorId).length == 0) {
          this.cols.push(vendor);
        }
      }
    });
  }
  //addRemarks(vendor: any, rowindex: any, vendorIndex: any) {
  //  var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
  //  this.selectedVendorList[index].Remarks = (<HTMLInputElement>document.getElementById("rmks" + rowindex + "" + vendorIndex)).value;
  //}

  selectVendorList(event: any, vendor: any, rowindex: any, vendorIndex: any, checkAll: boolean) {
    this.statusList = []
    this.status = "";
    if (!checkAll) {
      var index = this.selectedVendorList.findIndex(x => x.RFQItemsId == vendor.RFQItemsId);
      if (index < 0 && event.target.checked == true) {
        //vendor.Remarks = (<HTMLInputElement>document.getElementById("rmks" + rowindex + "" + vendorIndex)).value;
        this.selectedVendorList.push(vendor);
        const totalQty = this.selectedVendorList.filter(li => li.Itemdetailsid == vendor.Itemdetailsid).reduce((sum, item) => sum + item.vendorQuoteQty, 0);
        //if (totalQty > vendor.QuotationQty && (this.selectedVendorList.filter(li => li.Itemdetailsid == vendor.Itemdetailsid).length > 1)) {
        if (totalQty > vendor.MprQuantity && (this.selectedVendorList.filter(li => li.Itemdetailsid == vendor.Itemdetailsid).length > 1)) {
          this.statusList.push(rowindex + 1);
          event.target.checked = false;
          this.selectedVendorList.splice(index, 1);
          if ((this.selectedVendorList.filter(x => x.VendorId == vendor.VendorId)).length == 0)
            (<HTMLInputElement>document.getElementById("vendor" + vendorIndex)).checked = false;
          return;
        }
      }
      else {
        this.selectedVendorList.splice(index, 1);
        if ((this.selectedVendorList.filter(x => x.VendorId == vendor.VendorId)).length == 0)
          (<HTMLInputElement>document.getElementById("vendor" + vendorIndex)).checked = false;
      }
    }
    else {
      let index = 0;
      this.rfqQuoteModel.forEach((item, rowIndex: number) => {
        var itmVendor = item.suggestedVendorDetails[vendorIndex];
        var checked = (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked;
        //vendor.Remarks = (<HTMLInputElement>document.getElementById("rmks" + rowIndex + "" + vendorIndex)).value;
        index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
        if (itmVendor && itmVendor.VendorId == vendor.VendorId && index < 0 && event.target.checked == true && checked == false) {
          (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = true;
          this.selectedVendorList.push(itmVendor);
          const totalQty = this.selectedVendorList.filter(li => li.Itemdetailsid == itmVendor.Itemdetailsid).reduce((sum, item) => sum + item.vendorQuoteQty, 0);
          //if (totalQty > item.QuotationQty && (this.selectedVendorList.filter(li => li.Itemdetailsid == itmVendor.Itemdetailsid).length > 1)) {
          if (totalQty > item.MprQuantity && (this.selectedVendorList.filter(li => li.Itemdetailsid == itmVendor.Itemdetailsid).length > 1)) {
            this.statusList.push(rowindex + 1);
            (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = false;
            event.target.checked = false;
            index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
            if (index >= 0)
              this.selectedVendorList.splice(index, 1);
            //return;
          }
        }
        else {
          index = this.selectedVendorList.findIndex(x => x.RFQItemsId == itmVendor.RFQItemsId);
          if (index >= 0)
            this.selectedVendorList.splice(index, 1);
          (<HTMLInputElement>document.getElementById("ven" + rowIndex + "" + vendorIndex)).checked = false;
        }
      })
    }
    if (this.statusList.length > 0)
      this.status = " Quantity Exceeded at row number " + " " + this.statusList.toString();

  }

  //calculate total price with out handling charges
  calculateTotalPriceWOH(colIndex: any) {
    let totalPrice: number = 0;
    this.rfqQuoteModel.forEach(item => {
      if (item.suggestedVendorDetails[colIndex])
        totalPrice += parseFloat(item.suggestedVendorDetails[colIndex].MaterialTotalPrice);
    });
    return totalPrice.toFixed(2);
  }

  //calculate total handling charges
  calculateTotalPriceHC(colIndex: any) {
    let totalPrice: number = 0;
    this.rfqQuoteModel.forEach(item => {
      if (item.suggestedVendorDetails[colIndex])
        totalPrice += parseFloat(item.suggestedVendorDetails[colIndex].HandlingChargesTotal);
    });
    return totalPrice.toFixed(2);
  }
  //calculate total price with  handling charges
  calculateTotalPriceWH(colIndex: any) {
    let totalPrice: number = 0;
    this.rfqQuoteModel.forEach(item => {
      if (item.suggestedVendorDetails[colIndex])
        totalPrice += parseFloat(item.suggestedVendorDetails[colIndex].TotalPrice);
    });
    return totalPrice.toFixed(2);
  }

  //calculate total po price
  calculateTotalPOPrice() {
    let totalPrice: number = 0;
    this.rfqQuoteModel.forEach(item => {
      if (item.POPrice)
        totalPrice += parseFloat(item.POPrice);
    });
    return totalPrice;
  }

  discountCalculation(vendor: any) {
    this.tp = 0;
    if (vendor.UnitPrice && vendor.vendorQuoteQty)
      this.tp = vendor.UnitPrice * vendor.vendorQuoteQty;
    var PriceDis = 0;
    if (vendor.DiscountPercentage)
      PriceDis = this.tp - (this.tp * (vendor.DiscountPercentage / 100));
    if (vendor.Discount)
      PriceDis = this.tp - vendor.Discount;
    if (PriceDis)
      this.tp = PriceDis;
  }

  //calculate diccount perecentage
  calculateDiscountPer(vendor: any) {
    if (vendor) {
      return parseFloat(((vendor.DiscountPercentage / 100) * (vendor.UnitPrice * vendor.vendorQuoteQty)).toString()).toFixed(2);
    }
    else
      return "";
  }

  //calculate material total price with out handling charges
  calculateItemToatlPriceWOH(vendor) {
    var frfAmt = this.calculateFRAmount(vendor);
    var pfAmnt = this.calculatePFamount(vendor);
    return parseFloat(this.tp.toString()) + parseFloat(frfAmt.toString()) + parseFloat(pfAmnt.toString());
  }

  //calculate total handling charges
  calculateItemToatlPriceHC(vendor) {
    var value = parseFloat(vendor.HandlingAmount.toString()) + parseFloat(vendor.ImportFreightAmount.toString()) + parseFloat(vendor.InsuranceAmount.toString()) + parseFloat(vendor.DutyAmount.toString());
    return value;
  }
  //calculate material total price including handling charges
  calculateItemToatlPriceWH(vendor) {
    var frfAmt = this.calculateFRAmount(vendor);
    var pfAmnt = this.calculatePFamount(vendor);

    return parseFloat(this.tp.toString()) + parseFloat(frfAmt.toString()) + parseFloat(pfAmnt.toString()) + parseFloat(vendor.HandlingAmount.toString()) + parseFloat(vendor.ImportFreightAmount.toString()) + parseFloat(vendor.InsuranceAmount.toString()) + parseFloat(vendor.DutyAmount.toString());
  }

  calculateFRAmount(vendor: any) {
    let value: number = 0;
    if (vendor.FreightPercentage) {
      value = (this.tp) * (vendor.FreightPercentage / 100)
    }
    else {
      if (vendor.FreightAmount)
        value = vendor.FreightAmount;
    }
    return value;
  }
  calculatePFamount(vendor: any) {
    let value: number = 0;
    if (vendor.PFPercentage) {
      value = (this.tp) * (vendor.PFPercentage / 100);
    }
    else {
      if (vendor.PFAmount)
        value = vendor.PFAmount;
    }
    return value;
  }

  showDialog(itemdata: any, index: number) {
    this.showPODialog = true;
    this.poRowIndex = index;
    this.PreviousPrices.PONumber = itemdata.PONumber;
    if (itemdata.PODate != null)
      this.PreviousPrices.PODate = new Date(itemdata.PODate);
    else
      this.PreviousPrices.PODate = new Date();
    this.PreviousPrices.POUnitPrice = itemdata.POUnitPrice;
    this.PreviousPrices.PORemarks = itemdata.PORemarks;
    this.PreviousPrices.Itemdetailsid = itemdata.Itemdetailsid;
  }

  dialogCancel() {
    this.showPODialog = false;
  }

  addPreviousprice() {
    this.PreviousPrices.POPrice=this.PreviousPrices.POUnitPrice
    this.RfqService.PreviouPriceUpdate(this.PreviousPrices).subscribe(data => {
      if (data) {
        this.rfqQuoteModel[this.poRowIndex].PONumber = this.PreviousPrices.PONumber;
        this.rfqQuoteModel[this.poRowIndex].PODate = this.PreviousPrices.PODate;
        this.rfqQuoteModel[this.poRowIndex].POUnitPrice = this.PreviousPrices.POUnitPrice;
        this.rfqQuoteModel[this.poRowIndex].PORemarks = this.PreviousPrices.PORemarks;
        this.rfqQuoteModel[this.poRowIndex].POPrice=(Number(this.rfqQuoteModel[this.poRowIndex].POUnitPrice)*Number(this.rfqQuoteModel[this.poRowIndex].MprQuantity)).toString()
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Prices Added sucessfully' });
        this.showPODialog = false;

      }
    })
  }
  statusSubmit() {
   
    if (this.ShowMV_Justification && !this.mprRevisionModel.MVJustificationId) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select MV Justification' });
        return;
    }
  
    var itemList=this.rfqQuoteModel.filter(li => Number(li.POUnitPrice)<=0);
   
    if (this.selectedVendorList.length >0 ) {
      if(itemList.length>0)
      {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please enter Unit Price for each item' });
        return;
      }
      this.selectedVendorList.forEach((el) => { 
        el.CreatedBy = this.employee.EmployeeNo;
        el.MVJustificationId=this.mprRevisionModel.MVJustificationId
      })
       this.RfqService.statusUpdate(this.selectedVendorList).subscribe(data => {
        if (data)
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Status Updated sucessfully' });
      })
    }
    else
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Please select at leat one item' });
  }
  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
  ShowMVJustification(){
    if (this.RfqCompareItems[0].PurchaseType == "Multiple Vendor" && Number(this.RfqCompareItems[0].TargetSpend)>500000 )
    {
      this.ShowMV_Justification=true;
    }
    else
    {
      this.ShowMV_Justification=false;
    }
  }
  loadMPRMVJustification() {
    this.MprService.getMPRMVJustification().subscribe(data => {
      this.MprMVJustification = data;
    })
  }
  ExportTOExcel() {
    this.spinner.show();
    
    this.RfqService.IsExcelExported().subscribe((resultBlob: Blob)=> 
    {
      var downloadURL = URL.createObjectURL(resultBlob);
      var anchor = document.createElement("a");
      anchor.download = this.RfqCompareItems[0].DocumentNo+"_.xlsx";
      anchor.href = downloadURL;
      anchor.click();
      this.spinner.hide();
        });
  }  
  // public captureScreen()  
  // {  
  //   var data = document.getElementById('contentToConvert');  
  //   html2canvas(data).then(canvas => {  
  //     // Few necessary setting options  
  //     var imgWidth = 208;   
  //     var pageHeight = 295;    
  //     var imgHeight = canvas.height * imgWidth / canvas.width;  
  //     var heightLeft = imgHeight;  
  
  //     const contentDataURL = canvas.toDataURL('image/png')  
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //     var position = 0;  
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
  //     pdf.save('RFQComparision.pdf'); // Generated PDF   
  //   });  
  // } 
   


}


