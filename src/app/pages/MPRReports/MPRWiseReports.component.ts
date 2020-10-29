import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { PADetailsModel, ReportInputModel,ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-MPRWiseReports',
    templateUrl: './MPRWiseReports.component.html',
})

export class MPRWiseReportsComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
    constructor(private paService: purchaseauthorizationservice, private router: Router, private datePipe: DatePipe, public messageService: MessageService, private spinner: NgxSpinnerService, public formbuilder: FormBuilder) { }
    page: number;
    pageSize: number;
    public show: boolean = false;
    public buttonName: any = 'Show';
  public employee: Employee;
  public paid: number;
  public palist: any;
  public pofilters: PADetailsModel;
  public buyergroups: Array<any> = [];
  public Vendors: Array<any> = [];
  public statuslist: any[];
    public report: ReportInputModel;
    public projectmangers: any[];

  mycontrol = new FormControl();
  vendorcontrol = new FormControl();
  buyercontrol = new FormControl();
  filteredoptions: Observable<any[]>;
  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
      }
      this.report = new ReportInputModel();
      this.report.Fromdate = "2020-10-01";
      this.report.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
    this.buyergroups = new Array<any>();
    this.palist = new Array<any>();
    this.pofilters = new PADetailsModel();
    this.loadbuyergroups();
      
      this.statuslist = new Array<any>();
      this.GetMprWisestatusreport(this.report);
      this.loadprojectmangers();
      this.page = 1;
      this.pageSize = 500;
      this.projectmangers = new Array<any>();
  }
    ExportTOExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'MprWiseReport.xlsx');
    }  
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;
    })
    }
    GetMprWisestatusreport(report: ReportInputModel) {
        console.log("report", report)
        this.spinner.show();
        this.paService.Getmprstatuswise(report).subscribe(data => {
            this.spinner.hide();
            this.statuslist = data['Table'];
        })
    }
    loadprojectmangers() {
        this.paService.loadprojectmanagersforreport().subscribe(data => {
            this.projectmangers = data;
        })
    }
    toggle() {
        this.show = !this.show;
    }
}
