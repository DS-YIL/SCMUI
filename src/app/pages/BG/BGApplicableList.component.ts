import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { NgxSpinnerService } from 'ngx-spinner'
import { constants } from 'src/app/Models/MPRConstants';
import { BGfilters, Employee, BankGuarantee } from 'src/app/Models/mpr';
import { MessageService } from 'primeng/api';
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bgApp-list',
  templateUrl: './BGApplicableList.component.html'
})
export class BGApplicableListComponent implements OnInit {

  constructor(public MprService: MprService, private datePipe: DatePipe,private router: Router, private paService: purchaseauthorizationservice, private spinner: NgxSpinnerService, private messageService: MessageService, public constants: constants) { }
  public employee: Employee;
  public BGList: Array<any> = [];
  public BGfilters: BGfilters;
  public BGModel: BankGuarantee;
  public showBGDialog: boolean = false;
  public departmentlist: Array<any> = [];
  public buyergroups: Array<any> = [];

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else {
      this.router.navigateByUrl("Login");
      return true;
    }
    this.BGfilters = new BGfilters();
    this.BGfilters.FromDate = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 30)), "yyyy-MM-dd");
    this.BGfilters.ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.BGModel = new BankGuarantee();
    this.loadallmprdepartments();
    this.loadbuyergroups();
    this.bgList();
  }

  loadallmprdepartments() {
    this.paService.LoadAllDepartments().subscribe(data => {
      this.departmentlist = data;

    });
  }
  loadbuyergroups() {
    this.paService.LoadAllmprBuyerGroups().subscribe(data => {
      this.buyergroups = data;
    })
  }

  bgList() {
    this.spinner.show();
    this.MprService.getBGApplicableList(this.BGfilters).subscribe(data => {
      this.spinner.hide();
      this.BGList = data;
    })
  }
  displayBGDialog(details: any) {
    this.showBGDialog = true;
    this.BGModel = details;
  }

  onBGSubmit() {
    if (!this.BGModel.BGRemarks) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Enter Remarks' });
      return true;
    }
    this.BGModel.CreatedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.MprService.updateBG(this.BGModel).subscribe(data => {
      this.spinner.hide();
      this.BGModel = new BankGuarantee();
      if (data)
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'BG request sent' });
      else
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Failed' });
      this.showBGDialog = false;
    })

  }
  sendReminder(details: any) {
    this.BGModel = details;
    this.BGModel.CreatedBy = this.employee.EmployeeNo;
    this.spinner.show();
    this.MprService.updateBG(this.BGModel).subscribe(data => {
      this.spinner.hide();
      this.BGModel = new BankGuarantee();
      if (data)
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Reminder sent' });
      else
        this.messageService.add({ severity: 'error', summary: 'error', detail: 'Failed' });
      this.showBGDialog = false;
    })
  }
}
