import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service';
import { Employee, DynamicSearchResult } from '../../Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
import { padocuments, ItemsViewModel, MSAMasterConfimationModel, painutmodel, mprpapurchasetypesmodel, PAReportInputModel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel, StatusCheckModel } from 'src/app/Models/PurchaseAuthorization'
import { IfStmt } from '@angular/compiler';
@Component({
  selector: 'app-msaline-item-list',
  templateUrl: './msaline-item-list.component.html',
  styleUrls: ['./msaline-item-list.component.scss']
})
export class MSALineItemListComponent implements OnInit {
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  constructor(private paService: purchaseauthorizationservice, private router: Router, public MprService: MprService, private spinner: NgxSpinnerService, private messageService: MessageService) { }
  public employee: Employee;
  public incompletedlist: Array<any>[];
  public paid: number;
  public dynamicData = new DynamicSearchResult();
  public inputsearch: painutmodel;
  public MSALineItemList: Array<any>[];
  public MSALineItemListExport: Array<any>[];
  myFiles: string[] = [];
  myfiles1: string[] = [];
  public paDocuments: padocuments;
  public MSAConfirmationModel: MSAMasterConfimationModel;
  public MSAConfirmationMOdelForView: MSAMasterConfimationModel;
  public displayCommunicationDialog: boolean;
  public ShowConfirmbutton: boolean;
  public statusCheckModel: StatusCheckModel;


  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.paid;
    this.incompletedlist = new Array<any>();
    this.inputsearch = new painutmodel();
    this.MSAConfirmationModel = new MSAMasterConfimationModel();
    this.MSAConfirmationMOdelForView = new MSAMasterConfimationModel();
    this.ShowConfirmbutton = false;
    // this.getMSAlineItemList(this.inputsearch)
  }
  getMSAlineItemList(model: painutmodel) {
    {
      if (model.PAId > 0) {

        var qry = "select *,[Item No.] as itemNo,[Direct Shipping] as directShiping,[Ship to Party] as ShiptoParty,[Ship to Party seq. No.] as ShiptoPartyseqNo ,[Ship to Party Name] as ShiptoPartyName";
        qry = qry + ",[Ship to Party Address] as ShiptoPartyAddress,[Ship to Party Phone] as ShiptoPartyPhone,[Nuclear Spec Code] as NuclearSpecCode,[QW Box No.] as QWBoxNo,";
        qry = qry + "[Safe Proof ID] as SafeProofID,[XJNo.] as XJNo,[Product career code] as Productcareercode,[QIC Language] as QICLanguage,[QIC Delivery style] as QICDeliverystyle,[Document Quantity]as DocumentQuantity";
        qry = qry + ",[Document Item No.] as DocumentItemNo,[IM Language] as IMLanguage,[IM Attach Style] as IMAttachStyle,[Tokuchu IM No.] as TokuchuIMNo";
        qry = qry + ",[Parts Instrument Model] as PartsInstrumentModel,[Serial Information Flag] as SerialInformationFlag,[System Model] as SystemModel,[Additional work code 1] as Additionalworkcode1";
        qry = qry + ",[Additional work code 2] as Additionalworkcode2, [Additional work code 3] as Additionalworkcode3";
        qry = qry + ",[Additional work code 4] as Additionalworkcode4,[Additional work code 5] as Additionalworkcode5,[Work sheet flag] as Worksheetflag,[Work sheet Rev] as WorksheetRev";
        qry = qry + ",[Work sheet No.] as WorksheetNo,[Freight RSP (JPY)] as FreightRSPJPY,[Freight RSP (USD)] as FreightRSPUSD,[Freight RSP (EUR)] as FreightRSPEUR";
        qry = qry + ",[Combined MS-Code Indicator]as CombinedMSCodeIndicator,[Combined MS-Code Control Number] as CombinedMSCodeControlNumber";
        qry = qry + ",[Comp. No.]as CompNo,[Order Instruction Title code]as OrderInstructionTitlecode,[Order Instruction Title] as OrderInstructionTitle";
        qry = qry + ",[Input Type] as InputType,[Min.]as Min,[Max.] as Max";
        qry = qry + ",[Free Text] as FreeTexts,[Inquiry ID] as InquiryID,[Process flag INT for internal]as ProcessflagINTforinternal";

        var existQuery = "select * from MSALineItem where paid=" + model.PAId + " and deletionflag='False'";
        var exportQry = "";
        this.dynamicData = new DynamicSearchResult();
        this.dynamicData.query = existQuery;
        this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
          if (data.length > 0) {
            qry = qry + " from MSALineItem where paid=" + model.PAId + " and deletionflag='False' ";
            exportQry = exportQry + "select * from MSALineItem where paid=" + model.PAId + " and deletionflag='False'";
            this.dynamicData = new DynamicSearchResult();
            this.dynamicData.query = qry;
            this.spinner.show();
            this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
              this.MSALineItemList = data;
              this.dynamicData = new DynamicSearchResult();
              this.dynamicData.query = exportQry;
              this.MprService.getDBMastersList(this.dynamicData).subscribe(exportdata => {
                this.MSALineItemListExport = exportdata;
                this.spinner.hide();
              });

            });

          }
          else {
            qry = qry + " from RPALoadItemForMSA where paid=" + model.PAId + "";
            exportQry = exportQry + "select * from RPALoadItemForMSA where paid=" + model.PAId + "";
            this.dynamicData = new DynamicSearchResult();
            this.dynamicData.query = qry;
            this.spinner.show();
            this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
              this.MSALineItemList = data;
              this.dynamicData = new DynamicSearchResult();
              this.dynamicData.query = exportQry;
              this.MprService.getDBMastersList(this.dynamicData).subscribe(exportdata => {
                this.MSALineItemListExport = exportdata;
                this.spinner.hide();
              });

            });
          }
          this.GetPAConfirmationDetails(model.PAId);
        });
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'PAID Validation', detail: 'Please enter Valid PAID.' });
      }

    }

  }

  public excelExtport(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.MSALineItemListExport);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    XLSX.writeFile(wb, 'MSALineItemList.xlsx');
  }

  getFileuploadDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myfiles1.push(e.target.files[i]);
    }
    (<HTMLInputElement>document.getElementById("file1")).value = "";
  }
  removeSelecteduploadFile(index) {
    this.myfiles1.splice(index, 1);
  }
  uploadapprovedFiles(model: painutmodel) {
    if (model.PAId > 0) {
      if (this.myfiles1.length > 0) {
        const formData: FormData = new FormData();
        var paid = "" + model.PAId;
        var uploadby = "" + this.employee.EmployeeNo;
        for (var i = 0; i < this.myfiles1.length; i++) {
          formData.append(paid, this.myfiles1[i]);
          formData.append(uploadby, this.myfiles1[i]);
        }
        this.myfiles1.pop();
        this.spinner.show();
        this.paService.uploadMSADocument(formData).subscribe(data => {
          this.spinner.hide();
          if (data.Sid == 1) {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.StatusMesssage });
            this.getMSAlineItemList(model);
          }
          if (data.Sid == 2)
            this.messageService.add({ severity: 'error', summary: 'Confirmation Alert', detail: data.StatusMesssage });
          if (data.Sid == -2)
            this.messageService.add({ severity: 'error', summary: 'Excel Sheet Format Alert', detail: data.StatusMesssage });
          if (data.Sid == -1)
            this.messageService.add({ severity: 'error', summary: 'Upload error', detail: data.StatusMesssage });
        })
      }
      else {
        this.messageService.add({ severity: 'error', summary: 'File validation', detail: 'No File Selected for upload' });
      }

    }
    else {
      this.messageService.add({ severity: 'error', summary: 'PAID validation', detail: 'Please enter Valid PAID than try to uplaod.' });
    }

  }

  UpdateMSAConfirmation(model: painutmodel) {

    if (model.PAId > 0) {
      var data = new MSAMasterConfimationModel();
      data.Confirmationflag = true;
      data.Deleteflag = false;
      data.PAID = model.PAId;
      data.UploadedBy = this.employee.EmployeeNo;
      data.StatusRemarks = "Manual";
      this.MSAConfirmationModel = data;
      this.spinner.show();
      this.paService.UpdateMSAMasterConfirmation(this.MSAConfirmationModel).subscribe(data => {
        this.getMSAlineItemList(model);

        if (data != null) {
          if (data.StatusRemarks == "1") {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'PA item successfully confirmed' });
          }
          else if (data.StatusRemarks == "2") {
            this.messageService.add({ severity: 'error', summary: 'warning message', detail: 'PA item already confirmed' });
          }
          else if (data.StatusRemarks == "3") {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'PA Items has been dump to Line Item but not confirmed' });
          }
          else if (data.StatusRemarks == "4") {
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'PA Items has been dump to Line Item and successfully confirmed' });
          }
          else if (data.StatusRemarks == "-2") {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Mandatory column is Empty in View. Please Downlaod into excel fill data and uplaod.' });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'PA item not confirmed successfully' });
          }

        }
      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'PAID validation', detail: 'Please enter Valid PAID than try to Confirm.' });
    }
  }

  ShowclearPopup(model: painutmodel) {
    if (model.PAId > 0)
      this.displayCommunicationDialog = true;
    else
      this.messageService.add({ severity: 'error', summary: 'PAID validation', detail: 'Please enter Valid PAID than try to clear.' });
  }
  dialogCancel() {
    this.displayCommunicationDialog = false;
  }

  ClearMSAConfirmation(model: painutmodel) {
    if (model.PAId > 0) {
      var reset = new MSAMasterConfimationModel();
      reset.Deleteflag = true;
      reset.PAID = model.PAId;
      reset.DeletedBy = this.employee.EmployeeNo;
      reset.DeletedRemarks = this.MSAConfirmationModel.DeletedRemarks;
      this.MSAConfirmationModel = reset;
      this.spinner.show();
      this.paService.ClearMSAMasterConfirmation(this.MSAConfirmationModel).subscribe(data => {

        if (data != null) {
          if (data.StatusRemarks == "1") {
            this.messageService.add({ severity: 'error', summary: 'warning message', detail: 'Clear from Confirmation table only.' });
          }
          else if (data.StatusRemarks == "2") {
            this.messageService.add({ severity: 'success', summary: 'success message', detail: 'sucessfully Cleared from Confirmation and item table' });
          }
          else if (data.StatusRemarks == "0") {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'It is already Cleared' });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'PA item not cleared successfully' });
          }
          this.getMSAlineItemList(model);
        }

      })
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'PAID validation', detail: 'Please enter Valid PAID than try to clear.' });
    }
    this.dialogCancel();
  }

  GetPAConfirmationDetails(PAid) {
    var existQuery = " select * from  ("
    existQuery = existQuery + " select MSAMasterID,PAID,case Confirmationflag when 0 then 'Not Yet Confirm' when 1 then 'Confirmed' end as ConfirmationStatus,";
    existQuery = existQuery + "emp.Name as ConfirmedBy,emp1.Name as UploadedBy,ConfirmedDate,UplaodedDate,StatusRemarks,Confirmationflag,DeletedBy,DeletedDate,DeletedRemarks,Deleteflag from MSAMasterConfirmation msa";
    existQuery = existQuery + " left join Employee Emp on msa.ConfirmedBy=Emp.EmployeeNo left join Employee Emp1 on msa.UploadedBy=Emp1.EmployeeNo "
    existQuery = existQuery + " where Deleteflag='False' and PAID=" + PAid + "";
    existQuery = existQuery + " ) as Table1";
    existQuery = existQuery + " left join (";
    existQuery = existQuery + "select distinct MPRRevisions.RevisionId,MPRDetails.DocumentNo,PAItem.PAID from MPRItemInfo inner join MPRRevisions on MPRItemInfo.RevisionId=MPRRevisions.RevisionId";
    existQuery = existQuery + " inner join MPRDetails on MPRDetails.RequisitionId=MPRRevisions.RequisitionId inner join PAItem on PAItem.MPRItemDetailsId=MPRItemInfo.Itemdetailsid ";
    existQuery = existQuery + " and PAItem.PAID=" + PAid + " ";
    existQuery = existQuery + " ) as table2 on Table1.PAID=table2.PAID"


    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = existQuery;
    this.MprService.getDBMastersList(this.dynamicData).subscribe(data => {
      this.MSAConfirmationMOdelForView = data[0];
      if (this.MSAConfirmationMOdelForView)
        this.ShowConfirmbutton = !this.MSAConfirmationMOdelForView.Confirmationflag;
      else
        this.ShowConfirmbutton = true;
    });

  }

}
