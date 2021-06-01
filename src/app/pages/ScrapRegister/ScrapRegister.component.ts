import { Component, OnInit, Directive, Input, ElementRef} from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';

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
  public scrappageform; soform; vatinvoiceform; gatepassform; taxinvoiceform; dispatchform: FormGroup;
  public dynamicData = new DynamicSearchResult();
  public dialogTop: string;
  public txtName: string;
  public searchresult: Array<object> = [];
  public searchItems: Array<searchList> = [];
  public selectedItem: searchList;
  public showList: boolean = false;
  public Departmentsubmittted: boolean;
  public sosubmitted: boolean;
  public vatsubmitted: boolean;
  public gatepasssubmitted: boolean;
  public taxsubmitted; readyfordispatchsubmitted: boolean;
  public employee: Employee;
  myFiles: string[] = [];
  scrapFiles: string[] = [];
  public showedit: boolean = false;
  public scrapid: number;
  public scrapdata: any;
  public Approvedemployee: boolean = false;
  public scraprequestsubmitted: boolean = false;
  public Vatinvoice: boolean = false;
  public taxinvoice: boolean = false;
  public gatepass: boolean = false
  public SoCreated: boolean = false;
  public readyfordispatch: boolean = false;
  clonedProducts: { [s: string]: ScrapItems; } = {};
  public scrap: object;
  public filetype: string;
  public statusid: any[];
  public scrapitemtax: any;
  //private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  //private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  constructor(public constants: constants, private location: Location, private formBuilder: FormBuilder, public mprservice: MprService, private spinner: NgxSpinnerService, private datePipe: DatePipe, public messageService: MessageService, private router: Router, private route: ActivatedRoute, private paService: purchaseauthorizationservice, private routing: Router, private activeroute: ActivatedRoute) { }

  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
      console.log("employee", this.employee)
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.route.params.subscribe(params => {
      if (params["scrapid"]) {
        this.scrapid = params["scrapid"];
        //this.getscrapitembyid(this.scrapid);
      }
    })
    this.showedit = false;
    this.scrap;
    this.scrapmaster = new ScrapRegisterMasterModel();
    this.scrapitems = new ScrapItems();
    this.statusid = [];
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
      UnitPrice: ['', [Validators.required]],
      tcs: ['', [Validators.required]],
      sgstamount: [''],
      cgstamount: [''],
      igstamount: [''],
      Scraptype: ['', [Validators.required]],
      totalprice: [''],
      Vendor: ['', [Validators.required]],
    })
    this.scrappageform.controls['sgstamount'].clearValidators();
    this.scrappageform.controls['cgstamount'].clearValidators();
    this.scrappageform.controls['igstamount'].clearValidators();
    this.scrappageform.controls['totalprice'].clearValidators();
    this.dispatchform = this.formBuilder.group({
      verifiername: ['', [Validators.required]]
    })
    this.soform = this.formBuilder.group({
      SONO: ['', [Validators.required]],
      SoDate: ['']
    })
    this.vatinvoiceform = this.formBuilder.group({
      VATInvoiceno: ['', [Validators.required]],
      VatInvoiceDocumentUploaded: ['', [Validators.required]],
      VATInvoiceDate: ['']
    })
    this.gatepassform = this.formBuilder.group({
      GatePAssNo: ['', [Validators.required]],
      GatePassDate: [''],
      GatePassDocumentUploaded: ['']
    })
    this.taxinvoiceform = this.formBuilder.group({
      fundavailablewithvendor: ['', [Validators.required]],
      fundavendorremarks: [''],
      TaxInvoiceDocumentUpdated: ['']
    })
    this.dispatchform = this.formBuilder.group({
      verifierremarks: ['', [Validators.required]],
    })
    this.soform.controls['SoDate'].clearValidators();
    this.vatinvoiceform.controls['VATInvoiceDate'].clearValidators();
    this.vatinvoiceform.controls['VatInvoiceDocumentUploaded'].clearValidators();
    this.gatepassform.controls['GatePassDate'].clearValidators();
    this.gatepassform.controls['GatePassDocumentUploaded'].clearValidators();
    this.taxinvoiceform.controls['fundavendorremarks'].clearValidators();
    if (this.scrapid != undefined) {
      console.log("this.scrapid", this.scrapid)
      this.getscrapitembyid(this.scrapid)
    }
  }
  getscrapitembyid(scrapid: number) {
    this.showedit = true;
    this.paService.getscrapitembyid(scrapid).subscribe(data => {
      this.scrapmaster = data;
      this.scrapmaster.statustarck.forEach((item) => {
        this.statusid.push(item.stausid)
      })
      console.log("scrapmaster", this.scrapmaster)
      if (this.statusid.length > 0) {
        if (this.statusid.includes(1)) {
          this.SoCreated = false;
          this.Vatinvoice = false;
          this.taxinvoice = false;
        }
        if (this.statusid.includes(6)) {
          this.SoCreated = true;
        }
        if (this.statusid.includes(2)) {
          this.Vatinvoice = true;
          this.SoCreated = false;
        }
        if (this.statusid.includes(3)) {
          this.taxinvoice = true;
          this.readyfordispatch = true;
          this.Vatinvoice = false;
          this.SoCreated = false;
        }
        if (this.statusid.includes(5)) {
          this.taxinvoice = false;
        }
        if (this.statusid.includes(7)) {
          this.readyfordispatch = false;
        }
      }
      if (this.employee.EmployeeNo == this.scrapmaster.ApprovalBy && this.scrapmaster.Approvalstatus != "Approved") {
        this.Approvedemployee = true;
      }
      //if (this.scrapmaster.ScrapStatusId == 6) {
      //  this.SoCreated = true;
      //}
      //if (this.scrapmaster.ScrapStatusId == 2) {
      //  this.Vatinvoice = true;
      //}
      //if (this.scrapmaster.ScrapStatusId == 3) {
      //  this.gatepass = true;
      //}
      //if (this.scrapmaster.ScrapStatusId == 3) {
      //  this.taxinvoice = true;
      //}
      //if (this.scrapmaster.ScrapStatusId == 3) {
      //  this.readyfordispatch = true;
      //}
    })
  }
  getstatus(type: string) {
    if (type == 'socreated' && this.statusid.includes(2)) {
      return true;
    }
    if (type == 'vatinvoice' && this.statusid.includes(3)) {
      return true;
    }
    if (type == 'taxinvoice' && this.statusid.includes(5)) {
      return true;
    }
    if (type == 'dispatch' && this.statusid.includes(7)) {
      return true;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    //if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //  return false;
    //}
    //return true;
    if (charCode == 46) {
      //Check if the text already contains the . character
      if (event.value.indexOf('.') === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (charCode > 31 &&
        (charCode < 48 || charCode > 57))
        return false;
    }
    return true;
  }
  Approvescraprequest(data: ScrapRegisterMasterModel) {
    this.paService.Approvescraprequest(data).subscribe(data => {
      this.scrapmaster.ScrapStatusId = data.Scrapstatusid;
      window.location.reload();
      console.log("scrapmaster", this.scrapmaster)
    })
  }
  public bindSearchListData(e: any, formName?: string, name?: string, searchTxt?: string, rownumber?: number, callback?: () => any): void {
    this.dialogTop = e.clientY + 30 + "px";
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    this.dynamicData.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    //this.dynamicData.searchCondition += " Order By " + this.constants[name].fieldName + "";
    if (this.dynamicData.searchCondition && name == "ItemId")
      this.dynamicData.searchCondition += " OR Material" + " like '%" + searchTxt + "%'" + "group by Material";
    if (name == "Buyermanagers")
      this.dynamicData.query = "select mbg.BuyerManager,e.Name as Buyername from MPRBuyerGroups mbg inner join Employee e on e.EmployeeNo=mbg.BuyerManager";
    if (name == "verifier")
      this.dynamicData.query = "select distinct e.Name,sf.incharge from scrapflow sf inner join  Employee e on e.EmployeeNo=sf.incharge";
    if (name == "ItemId")
      this.dynamicData.query = "select  MAX(RFQRevisions_N.RFQType) as RFQType,MAX(RFQRevisions_N.QuoteValidTo) as QuoteValidTo, Material,MAX(Materialdescription) as Materialdescription from MaterialMasterYGS left join RFQItems_N on RFQItems_N.ItemId =MaterialMasterYGS.Material left join RFQRevisions_N on RFQRevisions_N.rfqRevisionId =RFQItems_N.RFQRevisionId" + this.dynamicData.searchCondition + " ";
    this.mprservice.GetListItems(this.dynamicData).subscribe(data => {
      //if (data.length == 0)
      //  this.showList = false;
      //else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {

        if (name == "venderid")
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
        else if (name == "ItemId") {
          fName = item[this.constants[name].fieldName] + " - " + item[this.constants[name].fieldId];
        }
        //else if
        //    fName = item[this.constants[name].fieldname] + " - " + item[""]
        else
          fName = item[this.constants[name].fieldName];
        var value = { listName: name, name: fName, code: item[this.constants[name].fieldId],rownumber };
        this.searchItems.push(value);
      });
    });
  }
  onsrchTxtChange(modelparm: string, model: string) {
    //if (value == "") {
      this[model][modelparm] = "";
    //}
  }
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    if (item.listName == "DepartmentId") {
      this.scrapmaster.RequesterDepartmentID = item.code;
      this.scrapmaster.DepartmentName = item.name;
    }
    else if (item.listName == "ItemId") {
      for (var i = 0; i < this.scrapmaster.scrapitems.length; i++) {
        if (item.rownumber == i) {
          this.scrapmaster.scrapitems[i].ItemId = item.name
          this.scrapmaster.scrapitems[i].Itemcode = item.code
        }
        if (this.scrapmaster.scrapitems[i].Itemcode != null) {
          this.paService.Getscrapitemdetails(this.scrapmaster.scrapitems[i].Itemcode).subscribe(data => {
            this.scrapitemtax = data;
            if (this.scrapitemtax != null) {
              for (var j = 0; j < this.scrapmaster.scrapitems.length; j++) {
                if (this.scrapmaster.scrapitems[j].Itemcode == data.Material) {
                  this.scrapmaster.scrapitems[j].cgstamount = this.scrapitemtax.CGSTPercentage,
                    this.scrapmaster.scrapitems[j].sgstamount = this.scrapitemtax.SGSTPercentage,
                    this.scrapmaster.scrapitems[j].igstamount = this.scrapitemtax.IGSTPercentage,
                    this.scrapmaster.scrapitems[j].UnitPrice = this.scrapitemtax.unitprice
                }
              }
            }
          })
        }
      }
    }
    else if (item.listName == "UnitId") {
      for (var i = 0; i < this.scrapmaster.scrapitems.length; i++) {
        this.scrapmaster.scrapitems[i].UOM = item.name
      }
    }
    else if (item.listName == "PreparedBy") {
      this.scrapmaster.RequestedName = item.name;
      this.scrapmaster.RequestedBY = item.code;
    }
    else if (item.listName == "Buyermanagers") {
      this.scrapmaster.ApprovalBy = item.code;
      this.scrapmaster.ApprovalName = item.name;
    }
    else if (item.listName == "venderid") {
      this.scrapmaster.Vendorcode = item.code;
      this.scrapmaster.Vendor = item.name;
    }
    else if (item.listName == "verifier") {
     //this['scrappageform'].controls['verifiername'].setValue(item.name);
      // this['dispatchform'].value['verifiername'] = item.name;
      this.scrapmaster.Verifier = item.code;
      this.scrapmaster.verifiername = item.name;
    }
  }
  dialogCancel(dialogName) {
    this[dialogName] = false;
  }
  onRowEditInit(product: ScrapItems, rowid: number) {
    if (product.ItemId == undefined) {
      product.Id = rowid;
      this.gettotalprice(product);
    }
    else {
      for (var i = 0; i < this.scrapmaster.scrapitems.length; i++) {
        if (this.scrapmaster.scrapitems[i].Itemcode == product.Itemcode)
          //this.scrapmaster.scrapitems[i].Itemcode = product.Itemcode
          return true;
      }
      //product.Id;
    }
    //this.clonedProducts[product.Id] = { ...product };
  }
  onRowEdit1Init(product: ScrapItems, rowid: number) {
      for (var i = 0; i < this.scrapmaster.scrapitems.length; i++) {
        this.scrapmaster.scrapitems[i].Itemcode == product.Itemcode
    }
    //this.clonedProducts[product.Id] = { ...product };
  }
  onRowEditSave(product: ScrapItems, rowid: number) {
    console.log("product", product)
    product.Id = rowid;
    //this.scrapmaster.scrapitems.push(product)
    console.log("this.scrapmaster", this.scrapmaster)
  }

  onRowEditCancel(product: ScrapItems, index: number) {
    //this.products2[index] = this.clonedProducts[product.id];
    //delete this.products2[product.id];
  }
  newRow() {
    var data = new ScrapItems();
    this.scrapmaster.scrapitems.push(data)
    //return { Id: '', Item: '', Description: '', UOM: '', Quantity: '', UnitPrice: '', Tcs: '', Tax:'' };
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
    if (this.myFiles.length > 0) {
      this.scrapmaster.PreparedBY = this.employee.EmployeeNo;
      this.paService.InsertScrapItems(this.scrapmaster).subscribe(data => {
        this.scrapdata = data;
        console.log("this.scrapdatatest", this.scrapdata)
        this.uploadFiles(data.Sid);
        this.showedit = true;
        this.getscrapitembyid(data.Sid);
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'errormessage Message', detail: 'Please upload file' });
    }
  }
  displayitems1(statusid: number, scrapflow: string) {
    this.scrapmaster.employeeno = this.employee.EmployeeNo;
    if (scrapflow == 'socreated') {
      this.sosubmitted = true;
      this.scrapmaster.scraptype = scrapflow;
      if (this.soform.invalid) {
        return;
      }
    }
    if (scrapflow =='vatinvoice') {
      this.vatsubmitted = true;
      this.scrapmaster.scraptype = scrapflow;
      if (this.vatinvoiceform.invalid) {
        return;
      }
    }
    if (scrapflow == 'gatepass') {
      this.gatepasssubmitted = true;
      this.scrapmaster.scraptype = scrapflow;
      if (this.gatepassform.invalid) {
        return;
      }
    }
    if (scrapflow == 'Taxinvoice') {
      this.taxsubmitted = true;
      this.scrapmaster.scraptype = scrapflow;
      if (this.taxinvoiceform.invalid) {
        return;
      }
    }
    if (scrapflow == 'readytodispatch') {
      this.readyfordispatchsubmitted = true;
      this.scrapmaster.scraptype = scrapflow;
      this.scrapmaster.Verifier = this.employee.EmployeeNo;
      if (this.dispatchform.invalid) {
        return;
      }
    }

    this.paService.Updatescraprequest(this.scrapmaster).subscribe(data => {
      //this.location.reload();
      window.location.reload();
      //this.reLoad();
      //this.getscrapitembyid(this.scrapid)
      if (this.scrapFiles.length > 0) {
        this.uploadscrapfiles();
      }
    })
  }
  reLoad() {
    this.router.navigate([this.router.url])
  }
  getFileDetails(e) {
    //this.myFiles = e.target.files;
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    (<HTMLInputElement>document.getElementById("file")).value = "";
  }
  removeSelectedFile(index) {
    this.myFiles.splice(index, 1);
  }
  uploadFiles(scrapid: number) {
    const frmData: FormData = new FormData();
    var scrapids = "" + scrapid;
    var employeeno = this.employee.EmployeeNo;
    (<HTMLInputElement>document.getElementById("file")).value = "";
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append(scrapids, this.myFiles[i]);
    }
    this.myFiles.pop();
    this.paService.uploadscrapExcel(frmData).subscribe(data => {
      //this.paDocuments = data
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'file uploaded Successfully' });
    })
  }
  gettotalprice(product: any) {
    var calu = ((product.UnitPrice * product.Qty) + (((product.UnitPrice * product.Qty) * product.cgstamount / 100) + ((product.UnitPrice * product.Qty) * product.sgstamount / 100) + ((product.UnitPrice * product.Qty) * product.igstamount / 100) + ((product.UnitPrice * product.Qty) * product.tcs / 100)))
    console.log("calu", calu)
    return calu;
    
  }
  viewDocument(path: string, documentname: string) {
    var path1 = path.replace(/\\/g, "/");
    console.log("mail", path1)
    path1 = this.constants.scrapdocumentpath + path1;
    console.log("path1",path1)
    window.open(path1);

  }
  numbersOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  Edit(text: string) {
    if (text == 'soedit') {
      this.SoCreated = true;
    }
    else if (text == 'vatinvoiceedit') {
      this.Vatinvoice = true
    }
    else if (text == 'vatinvoiceedit') {
      this.Vatinvoice = true
    }
    else if (text == 'taxedit') {
      this.taxinvoice = true;
    }
    else if (text == 'gatepassedit') {
      this.gatepass = true;
    }
    else {

    }
    //this.scrapmaster.SoDate = this.datePipe.transform(this.scrapmaster.SoDate, Date)
  }
  scrapflowfiles(e, file1: string) {
    let fileList: FileList = e.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      var scrapids = "" + this.scrapid;
      formData.append(scrapids, file, file.name + '-' + file1)
      this.paService.uploadscrapfileExcel(formData).subscribe(data => {
        //this.paDocuments = data
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'file uploaded Successfully' });
      })
    }
  }
  uploadscrapfiles() {
    const frmData: FormData = new FormData();
    var scrapids = "" + this.scrapid
    var employeeno = this.employee.EmployeeNo;
    (<HTMLInputElement>document.getElementById("file")).value = "";
    frmData.append(scrapids, this.filetype, scrapids);
    //for (var i = 0; i < this.scrapFiles.length; i++) {
    //  frmData.append(scrapids, this.scrapFiles[i]);
    //}
    console.log("frmData", frmData)
    this.scrapFiles.pop();
    this.paService.uploadscrapExcel(frmData).subscribe(data => {
      //this.paDocuments = data
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'file uploaded Successfully' });
    })
  }
}
