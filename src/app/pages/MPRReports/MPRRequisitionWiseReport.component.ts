import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MessageService } from 'primeng/api';
import { PADetailsModel, ReportInputModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, mprpapurchasemodesmodel, mprpadetailsmodel, padeletemodel } from 'src/app/Models/PurchaseAuthorization'
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-MPRRequisitionWiseReport',
    templateUrl: './MPRRequisitionWiseReport.component.html',
})
    //Name of Class: <<mprrequisitionWisecomponent >> Author :<< Akhil Kumar reddy >>
//    Date of Creation << 1 - 11 - 2019 >>
//        Purpose : << to show only Approved  mpr's by all approvers>>
//            Review Date:<<>> Reviewed By:<<>>
export class MPRRequisitionWiseReportComponent implements OnInit {
    @ViewChild('TABLE', { static: false }) TABLE: ElementRef;  
    constructor(private paService: purchaseauthorizationservice, private router: Router, private datePipe: DatePipe, public messageService: MessageService, private spinner: NgxSpinnerService, public formbuilder: FormBuilder) { }

  public employee: Employee;
    public paid: number;
    public show: boolean = true;
  public buyergroups: Array<any> = [];
  public statuslist: any[];
  public purchasedetails: mprpadetailsmodel;
    public reportinput: ReportInputModel;
    public departmentlist: any[];
    jobcodestotal: any = [];
    public searchdata: any;
    filteredoptions: Observable<any[]>;
    public filerlist: Array<any> = [];
    public mprprepares: any[];
    public mprcheckedby: any[];
    public mprApprovedby: any[];
    public purposetype: any[];
    public editable: boolean;
    public Orgdepartments: any[];
    ngOnInit() {
        this.reportinput = new ReportInputModel();
        this.loadallmprdepartments();
        this.Orgdepartments = new Array<any>();
        
    if (localStorage.getItem("Employee")) {
        this.employee = JSON.parse(localStorage.getItem("Employee"));
        if (this.employee.OrgDepartmentId != 14) {
            //this.reportinput.OrgDepartmentId = this.employee.OrgDepartmentId;
            this.editable = true;
        }
    }
    else {
      this.router.navigateByUrl("Login");
    }
    this.purchasedetails = new mprpadetailsmodel();
    this.buyergroups = new Array<any>();

      if (localStorage.getItem("statusDetails")) {
          this.reportinput = JSON.parse(localStorage.getItem("statusDetails"));
          this.GetMprRequisitionreport(this.reportinput);
          localStorage.removeItem("statusDetails");
          this.reportinput.DepartmentId = this.reportinput.DepartmentId;
      }
      else {
          this.reportinput.Fromdate = "2020-12-01";
          this.reportinput.Todate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      }
      this.mprprepares = new Array<any>();
      this.mprcheckedby = new Array<any>();
      this.mprApprovedby = new Array<any>();
      this.purposetype = new Array<any>();
      this.statuslist = new Array<any>();
      this.filerlist = new Array<any>();
      this.departmentlist = new Array<any>();
      
      this.getmprreportfilters();
      this.loadbuyergroups();
      this.searchdata = new Array<any>();
  }
        //Name of Function: << loadbuyergroups >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << To load all BuyerGroups >>
    //            Review Date:<<>> Reviewed By:<<>>
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
        this.buyergroups = data;
    })
    }
    //Name of Function: << GetMprRequisitionreport >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << to get all  approved mpr's based on date filter>>
    //            Review Date:<<>> Reviewed By:<<>>
    GetMprRequisitionreport(status: ReportInputModel) {
        if (this.employee.OrgDepartmentId != 14) {
            //status.OrgDepartmentId = this.Orgdepartments[0].ORgDepartmentid;
            console.log("this.Orgdepartments", this.Orgdepartments)
        }
        this.spinner.show();
        this.paService.GetmprrequisitionReport(status).subscribe(data => {
            this.spinner.hide();
            this.statuslist = data;
        })
    }
    getmprreportfilters() {
        this.paService.getmprreportfilters().subscribe(data => {
            this.filerlist = data;
            console.log("this.filerlist", this.filerlist['jobcode'][0])
            this.mprApprovedby = data['mprApprovedby']
            this.mprprepares = data['mprprepares']
            this.mprcheckedby = data['mprcheckedby']
            this.purposetype = data['purposetype']
            this.jobcodestotal = data['jobcode']
        })
    }
        //Name of Function: << loadallmprdepartments >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << to get all  mpr departments>>
    //            Review Date:<<>> Reviewed By:<<>>
    loadallmprdepartments() {
        this.paService.LoadAllDepartments().subscribe(data => {
            this.departmentlist = data;
            if (this.employee.OrgDepartmentId != 14) {
                this.Orgdepartments = this.departmentlist.filter(dep => dep.ORgDepartmentid === this.employee.OrgDepartmentId)
                this.reportinput.OrgDepartmentId = this.Orgdepartments[0].ORgDepartmentid;
                console.log("this.Orgdepartments", this.Orgdepartments)
            }
            else {
                this.Orgdepartments = this.departmentlist
                console.log("this.Orgdepartments", this.Orgdepartments)
            }

        });
    }
    //Name of Function: << ExportTOExcel >> Author :<< Akhil >>
    //    Date of Creation <<>>
    //        Purpose : << Exporting the table data  to excel>>
    //            Review Date:<<>> Reviewed By:<<>>
    ExportTOExcel() {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'requisitionSheet.xlsx');
    }
    toggle() {
        this.show= !this.show;
    }
}
