import { Component, OnInit , ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Employee, vendorRegfilters, DynamicSearchResult,Vendor, VendorUserMaster } from 'src/app/Models/mpr';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { constants } from 'src/app/Models/MPRConstants';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-VendorInfo',
  templateUrl: './VendorInfo.component.html'
})
export class VendorInfoComponent{
    constructor(public MprService: MprService, private route: ActivatedRoute, private router: Router, public constants: constants, private spinner: NgxSpinnerService,private messageService: MessageService,private formBuilder: FormBuilder,) { }

    public employee: Employee;
    public vendorId: number;
    public newVendor :FormGroup;
    public hideForVerifier;showNewVendor : boolean = true;
  // public datails: Array<any> = [];
  public datails: any;
    public vendorUserMaster = new VendorUserMaster();
    public vendorUserDetails : Array<any> = [];
    public enableUserAdd ;vendorSubmitted;showVendorDialog : boolean = false;
    ngOnInit() {
        if (localStorage.getItem("Employee")) {
          this.employee = JSON.parse(localStorage.getItem("Employee"));
        }
        else {
          this.router.navigateByUrl("Login");
        } 
        this.route.params.subscribe(params => {
            if (params["VendorId"] && !this.constants.RequisitionId) {
              this.vendorId = params["VendorId"];
              this.getVendorInfo();
              this.getUserInfo();
              
             
            }
          });
          this.newVendor = this.formBuilder.group({
            ContactPerson: ['', [Validators.required]],
            Emailid: ['', [Validators.required]],
            ContactNo: ['', [Validators.required, Validators.maxLength(10)]]
          })
    }

    getVendorInfo() {
        this.MprService.getVendorInfo(this.vendorId).subscribe(data => {
            this.datails = data;
            console.log(data);
        });
      }

      getUserInfo(){
        this.MprService.getVendorUserInfo(this.vendorId).subscribe(data =>{
          this.vendorUserDetails = data;
          
        });
      }

      DeactivateVendor(vendorUser : any){
        if(confirm("Are you sure, You want to Deactivate?")) {
          this.spinner.show();
          vendorUser.UpdatedBy = this.employee.EmployeeNo;
        this.MprService.deleteVendorUser(vendorUser).subscribe({
          next: data => {
            this.enableUserAdd=false;
              this.getUserInfo();
              alert('Deactivated successfully');
          },
          error: error => {
              alert( error.message);
              alert(error);
          }
      });
      this.spinner.hide();
    }
  }
      

      EnableUserAdd(){
        this.enableUserAdd=true;
      }

      ValidateEmail() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.vendorUserMaster.Vuserid)) {
          return true;
        }
        else{
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'You have entered an invalid email address!' });
        return false;
        }
      }

      AddNewVendorUserUser(){
          this.vendorSubmitted = true;
          if (this.newVendor.invalid) {
            return;
          }
          if(!this.ValidateEmail())
          {
              return;
          }
          this.enableUserAdd = false;
          this.vendorUserMaster.VendorId = this.vendorId;
          this.vendorUserMaster.UpdatedBy = this.employee.EmployeeNo;
          this.MprService.AddNewUser(this.vendorUserMaster).subscribe({
            next: data => {
                this.getUserInfo();
                alert('Added successfully');
            },
            error: error => {
                alert( error.message);
                alert(error);
            }
        });
     
      }
    

      dialogCancel(dialogName) {
        this[dialogName] = false;
        this.enableUserAdd=false;
      }
     
}
