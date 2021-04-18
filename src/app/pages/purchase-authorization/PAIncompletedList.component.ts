import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { Employee } from '../../Models/mpr';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { PADetailsModel, padeletemodel, ItemsViewModel, EmployeeModel, painutmodel, mprpapurchasetypesmodel, PAReportInputModel, PAApproverDetailsInputModel, mprpapurchasemodesmodel, mprpadetailsmodel, StatusCheckModel } from 'src/app/Models/PurchaseAuthorization'
@Component({
    selector: 'app-PAIncompletedList',
    templateUrl: './PAIncompletedList.component.html',
})
export class PAIncompletedListComponent implements OnInit {

  constructor(private paService: purchaseauthorizationservice, private router: Router, public formbuilder: FormBuilder) { }

    public employee: Employee;
    public incompletedlist: Array<any>[];
    public paid: number;
    public palist: any;
    public buyergroups: any[];
    public departmentlist: any[];
    public paapproverdeatils: Array<any>[];
    public purchasedetails: mprpadetailsmodel;
  public inputsearch: painutmodel;
  public DeleteDialog: boolean;
  public PADeleteForm1: FormGroup;
  public padelete: padeletemodel;
  public editable: boolean;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
            this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
            this.router.navigateByUrl("Login");
        }
        this.paid ;
        this.purchasedetails = new mprpadetailsmodel();
        this.buyergroups = new Array<any>();
        this.departmentlist = new Array<any>();
        this.incompletedlist = new Array<any>();
        this.paapproverdeatils = new Array<any>();
        this.inputsearch = new painutmodel();
      this.loadAllIncompltedpalist(this.inputsearch)
      this.DeleteDialog = false;
      this.editable = true;
      this.padelete = new padeletemodel();
      this.PADeleteForm1 = this.formbuilder.group({
        Remarks: ['', [Validators.required]]
      })
    }


    loadAllIncompltedpalist(model: painutmodel) {
        this.paService.loadAllIncompltedpalist(model).subscribe(data => {
            this.incompletedlist = data;
        })
    }
  deletepa(padelete: padeletemodel) {
    console.log("ferefe", padelete)
    this.DeleteDialog = true;
    this.paid = padelete.PAId
  }
  //Name of Function: << finaldelete >> Author :<< Akhil >>
  //    Date of Creation <<>>
  //        Purpose : << Deleting the purchase authorization by paid>>
  //            Review Date:<<>> Reviewed By:<<>>
  finaldelete(padelete: padeletemodel) {
    this.DeleteDialog = false;
    padelete.PAId = this.paid;
    padelete.employeeno = this.employee.EmployeeNo;
    this.paService.Deletepa(padelete).subscribe(data => {
      this.paid = data;
      this.loadAllIncompltedpalist(this.inputsearch)
      //this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'PA Deleted Successfully' });
      //this.GetMprpadetailsBySearch(this.pofilters);
    })

  }
  Cancel() {
    this.DeleteDialog = false;
  }
    //LoadmprApproverDetailsbySearch(inpusearch: PAApproverDetailsInputModel) {
    //    inpusearch.CreatedBy = this.employee.EmployeeNo;
    //    this.paService.LoadmprApproverDetailsbySearch(inpusearch).subscribe(data => {
    //        this.paapproverdeatils = data;
    //    })
    //}
    //LoadReport(reportsearch: PAReportInputModel) {
    //    this.paService.loadpareport(reportsearch).subscribe(data => {
    //        this.palist = data;
    //    })
    //}
}
