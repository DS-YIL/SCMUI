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
    selector: 'app-ProjectDurationReports',
    templateUrl: './ProjectDurationReports.component.html',
})

export class ProjectDurationReportsComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
    
    constructor(private paService: purchaseauthorizationservice, private router: Router, private datePipe: DatePipe, public messageService: MessageService, private spinner: NgxSpinnerService, public formbuilder: FormBuilder) { }
    page: number;
    pageSize: number;
    public show: boolean = true;
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
    public jobcodes: any[];
    public saleorder: any[];
    public departmentlist: any[];
    public editable: boolean;
  mycontrol = new FormControl();
  vendorcontrol = new FormControl();
  buyercontrol = new FormControl();
    filteredoptions: Observable<any[]>;
   public Orgdepartments: any[];
    ngOnInit() {
        this.report = new ReportInputModel();
        this.pofilters = new PADetailsModel();
        this.departmentlist = new Array<any>();
        this.loadallmprdepartments();
    if (localStorage.getItem("Employee")) {
        this.employee = JSON.parse(localStorage.getItem("Employee"));
        if (this.employee.OrgDepartmentId != 14) {
            this.report.OrgDepartmentId = this.employee.OrgDepartmentId;
            this.editable = true;
        }
    }
    else {
      this.router.navigateByUrl("Login");
      }
      
      this.report.Fromdate = "2020-12-01";
      this.report.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
    this.buyergroups = new Array<any>();
    this.palist = new Array<any>();
   
    this.loadbuyergroups();
      
      this.statuslist = new Array<any>();
      //this.GetProjectDurationWisereport(this.report);
      this.loadprojectmangers();
      this.loadjobcodes();
      this.page = 1;
      this.pageSize = 500;
      this.projectmangers = new Array<any>();
      this.jobcodes = new Array<any>();
      this.saleorder = new Array<any>();
      this.Loadsaleorder();
  }
    ExportTOExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'ProjectDurationReport.xlsx');
    }  
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;
    })
    }
    GetProjectDurationWisereport(report: ReportInputModel) {
        this.spinner.show();
        this.paService.GetProjectDurationWisereport(report).subscribe(data => {
            this.spinner.hide();
            this.statuslist = data;
        })
    }
    loadjobcodes() {
        this.paService.Loadjobcodes().subscribe(data => {
            this.jobcodes = data;
        })
    }
    loadprojectmangers() {
        this.paService.loadprojectmanagersforreport().subscribe(data => {
            this.projectmangers = data;
        })
    }
    Loadsaleorder() {
        this.paService.Loadsaleorder().subscribe(data => {
            this.saleorder = data;
        })
    }
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            if (this.employee.OrgDepartmentId != 14) {
                this.Orgdepartments = this.departmentlist.filter(dep => dep.ORgDepartmentid === this.employee.OrgDepartmentId)
                this.report.OrgDepartmentId = this.Orgdepartments[0].ORgDepartmentid;
                console.log("this.Orgdepartments", this.Orgdepartments)
            }
            else {
                this.Orgdepartments = this.departmentlist
                console.log("this.Orgdepartments", this.Orgdepartments)
            }
        });
    }
    toggle() {
        this.show = !this.show;
    }
}
