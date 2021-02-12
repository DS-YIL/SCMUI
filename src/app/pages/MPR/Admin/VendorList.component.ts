import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { Router } from '@angular/router';
import { Employee, vendorRegfilters, DynamicSearchResult } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-MPRList',
  templateUrl: './VendorList.component.html'
})

export class VendorListComponent{
  constructor(public MprService: MprService, private router: Router, public constants: constants, private spinner: NgxSpinnerService) { }

  public employee: Employee;
  public dynamicSearchResult: DynamicSearchResult;
  public vendorList: Array<any> = [];
  public statusList: Array<any> = [];
  public dynamicData = new DynamicSearchResult();
  public hideForVerifier: boolean = true;

  ngOnInit() {
    if (localStorage.getItem("Employee")) {
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    }
    else {
      this.router.navigateByUrl("Login");
    }

    this.vendorList = [];
    this.getVendorReqList();
  }
  vendorDetails(details: any) {
    this.router.navigate([]).then(result => {
      window.open('/SCM/VendorInfo/' + details.Vendorid + '', '_blank');
    });
  }
 

  getVendorReqList() {
    this.spinner.show();
    this.MprService.GetVendorList().subscribe(data => {
      this.spinner.hide();
      this.vendorList = data;
    });
  }

}