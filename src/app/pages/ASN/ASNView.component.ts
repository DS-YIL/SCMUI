import { Component, OnInit } from '@angular/core';
import { RfqService } from 'src/app/services/rfq.service ';
import { AsnModels, ASNCommunication, InvoiceDetails } from 'src/app/Models/rfq';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import { MessageService } from 'primeng/api';
import { constants } from 'src/app/Models/MPRConstants';
import { Employee } from 'src/app/Models/mpr';

@Component({
  selector: 'app-asn-view',
  templateUrl: './ASNView.component.html'
})
export class AsnViewComponent implements OnInit {

  public employee: Employee;
  // public asnItem: any;
  public asnItem = new AsnModels();
  public asnid: number = 0;
  public ASNCommunications = new ASNCommunication();
  public displayCommunicationDialog: boolean = false;
  public InvoiceDetails: InvoiceDetails;

  constructor(public RfqService: RfqService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, public constants: constants, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else {
      this.router.navigateByUrl("Login");
      return true;
    }
    this.InvoiceDetails = new InvoiceDetails();
    this.InvoiceDetails.InvoiceDocuments = [];
    this.route.params.subscribe(params => {
      this.asnid = params["ASNId"];
      this.getASNDetails();
    });

  }

  //get ASN Details

  getASNDetails() {
    this.spinner.show();
    this.RfqService.getAsnByAsnno(this.asnid).subscribe(data => {
      this.spinner.hide();
      this.asnItem = data;
      var arr = this.asnItem.ASNItemDetails.map(({ PONo }) => PONo)
      arr = arr.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
      this.asnItem.PONo = arr.toString();
      this.GetInvoiceDetails();
    })
  }

  //invoice details
  GetInvoiceDetails() {
    this.spinner.show();
    this.InvoiceDetails.InvoiceNo = this.asnItem.InvoiceNo;
    this.InvoiceDetails.ASNId = this.asnid;
    this.RfqService.GetInvoiceDetails(this.InvoiceDetails).subscribe(data => {
      this.spinner.hide()
      if (data)
        this.InvoiceDetails = data;
    })
  }

  showASNCommunicationDialogToAdd() {
    this.ASNCommunications = new ASNCommunication();
    this.displayCommunicationDialog = true;
  }

  dialogCancel() {
    this.displayCommunicationDialog = false;
  }

  //update ASN coomunication
  onCommnicationSubmit() {
    if (this.ASNCommunications.Remarks) {
      this.ASNCommunications.ASNId = this.asnid;
      this.ASNCommunications.RemarksFrom = this.employee.EmployeeNo;
        this.spinner.show();
      this.RfqService.updateASNComminications(this.ASNCommunications).subscribe(data => {
          this.spinner.hide();
        if (data) {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Remarked Added' });
          this.displayCommunicationDialog = false;
          this.getASNDetails();
        }
        })
 
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter Remarks' });
    }
  }

  viewDocument(path: string) {
    var path1 = path.replace(/\\/g, "/");
    path1 = this.constants.Documnentpath + path1;
    window.open(path1);
  }
}
