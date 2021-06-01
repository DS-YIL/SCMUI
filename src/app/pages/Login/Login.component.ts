import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MprService } from 'src/app/services/mpr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee, DynamicSearchResult, AccessList } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";
import { purchaseauthorizationservice } from 'src/app/services/purchaseauthorization.service'
import { MENU_ITEMS } from '../pages-menu';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private paService: purchaseauthorizationservice, private cdRef: ChangeDetectorRef, public MprService: MprService, private route: ActivatedRoute, private router: Router, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  public LoginForm: FormGroup;
  public employee: Employee;
  public AccessList: Array<AccessList> = [];
  public LoginSubmitted: boolean = false;
  public dynamicData = new DynamicSearchResult();
  public dataSaved: boolean = false;
  public returnUrl: string;
  public scraplist: Array<any> = [];

  ngOnInit() {

    //this.employee = new Employees();
    //localStorage.removeItem('Employee');
    //localStorage.removeItem('currentUser');
    //localStorage.removeItem('EmployeeList');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.LoginForm = this.formBuilder.group({
      DomainId: ['', [Validators.required]],
      Password: ['', [Validators.required]],
    });
  }

  Login() {
    this.LoginSubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      const loginDetails = this.LoginForm.value;
      this.dynamicData.tableName = "Employee";
      this.dynamicData.columnValues = loginDetails.DomainId + "," + loginDetails.Password;
      this.dynamicData.searchCondition = "DomainId='" + loginDetails.DomainId + "'";
      //this.MprService.getAuth_token(loginDetails).subscribe(data => {
      //  localStorage.setItem('AccessToken', JSON.stringify(data));

      this.MprService.ValidateLoginCredentials(this.dynamicData)
        .pipe(first())
        .subscribe(data1 => {
          this.spinner.hide();
          if (data1.EmployeeNo != null) {
            this.employee = data1;

            this.MprService.getAccessList(this.employee.RoleId).subscribe(data => {
              localStorage.setItem("AccessList", JSON.stringify(data));
              this.AccessList = data;

              if (this.AccessList.filter(li => li.AccessName == "CreateMPR").length <= 0) {
                var index = MENU_ITEMS[1].children.findIndex(li => li.title == "MPR Form");
                MENU_ITEMS[1].children.splice(index, 1);
              }

              if (this.employee.OrgDepartmentId != 14)//cmm users
              {
                MENU_ITEMS[2].hidden = true;//RFQ
                MENU_ITEMS[3].hidden = true;//masters
                MENU_ITEMS[4].hidden = true;//PA
                MENU_ITEMS[5].hidden = true;//auth
                MENU_ITEMS[6].hidden = true; //Reports
                MENU_ITEMS[7].hidden = true; //Vendor Reg
                MENU_ITEMS[9].hidden = true; //ASN
                MENU_ITEMS[10].hidden = true; //BG
                MENU_ITEMS[11].hidden = true;//scrap
              }
              else {
                MENU_ITEMS[2].hidden = false;
                MENU_ITEMS[3].hidden = false;
                MENU_ITEMS[4].hidden = false;
                MENU_ITEMS[5].hidden = false;
                MENU_ITEMS[6].hidden = false;
                MENU_ITEMS[7].hidden = false; //Vendor Reg
                MENU_ITEMS[9].hidden = false; //ASN
                MENU_ITEMS[10].hidden = false; //BG
                MENU_ITEMS[11].hidden = true;//scrap
              }
              //check finance login to show vendor reg
              if (this.employee.EmployeeNo == this.constants.VendorReg_Verifier1 || this.employee.EmployeeNo == this.constants.VendorReg_Verifier2 || this.employee.EmployeeNo == this.constants.VendorReg_Fin_Approver)
                MENU_ITEMS[7].hidden = false

              if (this.AccessList.filter(li => li.AccessName == "AddMasters").length <= 0)
                MENU_ITEMS[3].hidden = true;//masters
              if (this.AccessList.filter(li => li.AccessName == "AddAutherization").length <= 0)
                MENU_ITEMS[5].hidden = true;//auth
              if (this.AccessList.filter(li => li.AccessName == "SavingsReport").length <= 0) {
                var index = MENU_ITEMS[6].children.findIndex(li => li.title == "Savings Report");
                MENU_ITEMS[6].children[index].hidden = true;
              }
              else {
                var index = MENU_ITEMS[6].children.findIndex(li => li.title == "Savings Report");
                MENU_ITEMS[6].children[index].hidden = false;
              }
              if (this.AccessList.filter(li => li.AccessName == "MPRStatusTrack").length <= 0) {
                var index = MENU_ITEMS[6].children.findIndex(li => li.title == "MPR Status Track");
                MENU_ITEMS[6].children[index].hidden = true;
              }
              else {
                var index = MENU_ITEMS[6].children.findIndex(li => li.title == "MPR Status Track");
                MENU_ITEMS[6].children[index].hidden = false;
              }
              if (this.AccessList.filter(li => li.AccessName == "PAdepartmentView").length <= 0) {
                var index = MENU_ITEMS[1].children.findIndex(li => li.title == "PA Approval Tracking");
                MENU_ITEMS[1].children[index].hidden = true;
              }
              else {
                var index = MENU_ITEMS[1].children.findIndex(li => li.title == "PA Approval Tracking");
                MENU_ITEMS[1].children[index].hidden = false;
              }
              if (this.employee.OrgDepartmentId == 14) {
                var index = MENU_ITEMS[1].children.findIndex(li => li.title == "PA Approval Tracking");
                MENU_ITEMS[1].children[index].hidden = true;
              }
              if (this.employee.EmployeeNo != null) {
                this.paService.getscrapflowlist().subscribe(scrapdata => {
                  this.scraplist = scrapdata;
                  if (this.scraplist.length > 0) {
                    var index = this.scraplist.findIndex(li => li.Incharge == this.employee.EmployeeNo);
                    if (index > -1) {
                      MENU_ITEMS[11].hidden = false;
                    }
                  }
                })
              }
            })

            this.LoginForm.reset();
            if (this.returnUrl)
              this.router.navigateByUrl(this.returnUrl);
            else
              //this.router.navigateByUrl('/SCM/MPRList');
              this.router.navigateByUrl('/SCM/Dashboard');

          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Invalid Domain Id & Password' });
            return;
          }
        });
      //})
    }

  }
}
