import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RfqService } from 'src/app/services/rfq.service ';
import { NgxSpinnerService } from 'ngx-spinner'
import { constants } from 'src/app/Models/MPRConstants';
import { ASNfilters } from 'src/app/Models/mpr';
import { InvoiceDetails } from 'src/app/Models/rfq';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-Insurance-list',
  templateUrl: './InsuranceReport.component.html'
})
export class InsuranceReport implements OnInit {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  constructor(public RfqService: RfqService, private spinner: NgxSpinnerService, public constants: constants, private messageService: MessageService, private datePipe: DatePipe) { }

  public AsnList: Array<any> = [];
  public ASNfilters: ASNfilters;
  public InvoiceDetails: InvoiceDetails;

  ngOnInit() {
    this.ASNfilters = new ASNfilters();
    this.ASNfilters.Type = "CreatedDate";
    this.ASNfilters.ReportType = "Insurance";
    this.ASNfilters.FromDate = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 90)), "yyyy-MM-dd");
    this.ASNfilters.ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.InvoiceDetails = new InvoiceDetails();
    this.InvoiceDetails.InvoiceDocuments = [];
   // this.asnList();
  }

  asnList() {
    this.spinner.show();
    this.RfqService.getasnlist(this.ASNfilters).subscribe(data => {
      this.spinner.hide();
      this.AsnList = data;
    })

  }
  //ExportTOExcel() {
  //  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'Insurance.xlsx');
  //}

  ExportTOExcel() {
    debugger;
    if (this.AsnList.length > 0) {
      let datep = this.datePipe;
      let format = "dd.MM.yyyy";
      let new_list = this.AsnList.map(function (obj) {
        var InvoiceDate = datep.transform(obj.InvoiceDate, format);
        var ShippingDate = datep.transform(obj.ShippingDate, format);
        var POandDate = obj.PONos;
        if (obj.PODate)
          POandDate += ' & ' + datep.transform(obj.PODate, format)
        return {
          'VendorName && Code': obj.VendorName,
          'PO NO && Date': POandDate,
          'Project Name': obj.ProjectName,
          'Invoice No': obj.InvoiceNo,
          'Invoice Date': InvoiceDate,
          'Shipping Date': ShippingDate,
          'Inco Terms': obj.IncoTerm,
          'Insurance': obj.Insurance,
          'Transporter Name': obj.TransporterName,
          'LR No': obj.BillofLodingNumber,
          'Invoice Amount': obj.InvoiceAmntByVendor,
        }
      });
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(new_list);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Insurance Report");
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: '', detail: 'No data exists' });
      return;
    }

  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
