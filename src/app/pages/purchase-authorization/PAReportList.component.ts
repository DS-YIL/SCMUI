import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { NgxSpinnerService } from "ngx-spinner";
import { PADetailsModel, ItemsViewModel, EmployeeModel, mprpapurchasetypesmodel, PAReportInputModel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-PAReportList',
    templateUrl: './PAReportList.component.html',
})
export class PAReportListComponent implements OnInit {

    constructor(private paService: purchaseauthorizationservice, private router: Router, private spinner: NgxSpinnerService,) { }

    public employee: Employee;
    public approverslist: Array<any>[];
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
    public paapproverdeatils: Array<any>[];
    public purchasedetails: mprpadetailsmodel;
    public inputsearch: PAApproverDetailsInputModel;
    public reportsearch: PAReportInputModel;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }

        this.purchasedetails = new mprpadetailsmodel();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.loadAllmprpaapproverslist();
        this.approverslist = new Array<any>();
        this.paapproverdeatils = new Array<any>();
        this.inputsearch = new PAApproverDetailsInputModel();
        this.reportsearch = new PAReportInputModel();
        this.LoadmprApproverDetailsbySearch(this.inputsearch);
    }


    loadAllmprpaapproverslist() {
        this.paService.loadAllmprpaapproverslist().subscribe(data => {
            this.approverslist = data;
        })

    }

    LoadmprApproverDetailsbySearch(inpusearch: PAApproverDetailsInputModel) {
        inpusearch.CreatedBy = this.employee.EmployeeNo;
        this.paService.LoadmprApproverDetailsbySearch(inpusearch).subscribe(data => {
            this.paapproverdeatils = data;
        })
    }
    LoadReport(reportsearch: PAReportInputModel) {
        this.spinner.show();
        this.paService.loadpareport(reportsearch).subscribe(data => {
            this.spinner.hide();
            this.palist = data;
        })
    }
}
