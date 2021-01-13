import { Component, OnInit } from '@angular/core';
import { RfqService } from 'src/app/services/rfq.service ';
import { NgxSpinnerService } from 'ngx-spinner'
import { constants } from 'src/app/Models/MPRConstants';
import { ASNfilters } from 'src/app/Models/mpr';
import { InvoiceDetails } from 'src/app/Models/rfq';
import { saveFile, saveAs } from 'file-saver';

@Component({
  selector: 'app-asn-list',
  templateUrl: './ASNList.component.html'
})
export class AsnListComponent implements OnInit {

  constructor(public RfqService: RfqService, private spinner: NgxSpinnerService, public constants: constants) { }

  public AsnList: Array<any> = [];
  public ASNfilters: ASNfilters;
  public InvoiceDetails: InvoiceDetails;

  ngOnInit() {
    this.ASNfilters = new ASNfilters();
    this.InvoiceDetails = new InvoiceDetails();
    this.InvoiceDetails.InvoiceDocuments = [];
    this.asnList();
  }

  asnList() {
    this.spinner.show();
    this.RfqService.getasnlist(this.ASNfilters).subscribe(data => {
      this.spinner.hide();
      this.AsnList = data;
    })

  }
  //invoice details
  async MergeInvoiceDocs(details: any) {
    this.spinner.show();
    this.InvoiceDetails.InvoiceNo = details.InvoiceNo;
    this.InvoiceDetails.ASNId = details.ASNId;
    this.RfqService.MergeInvoiceDocs(this.InvoiceDetails).subscribe(async data => {
      this.spinner.hide();
      this.downloadFile(data);
    });



  }
  downloadFile(data) {
    saveAs(data, "InvoiceMerge" + "_" + this.InvoiceDetails.InvoiceNo + "_" + Date.now() + ".pdf");
  }


}
