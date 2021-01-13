import { Component, OnInit } from '@angular/core';
import { MprService } from 'src/app/services/mpr.service';
import { RfqService } from 'src/app/services/rfq.service ';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee, searchList, ASNInitiate, DynamicSearchResult } from 'src/app/Models/mpr';
import { constants } from 'src/app/Models/MPRConstants';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ASNInitiate',
  templateUrl: './ASNInitiate.component.html'
})
export class ASNInitiateComponent implements OnInit {

  constructor(public MprService: MprService, public RfqService: RfqService, private route: ActivatedRoute, private router: Router, public constants: constants, private messageService: MessageService, private spinner: NgxSpinnerService) { }

  public employee: Employee;
  public ASNInitiate: ASNInitiate;
  public dynamicData = new DynamicSearchResult();
  public formName: string;
  public txtName: string;
  public vendorEmailList: Array<any> = [];
  public selectedEmailList: Array<any> = [];
  public searchItems: Array<searchList> = [];
  public selectedlist: Array<searchList> = [];
  public selectedItem: searchList;
  public searchresult: Array<object> = [];
  public vendorId: number;
  public showList: boolean = false;
  public VendorEmailId: string;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.ASNInitiate = new ASNInitiate();
  }

  public bindSearchListData(name?: string, searchTxt?: string): void {
    this.txtName = name;
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.tableName = this.constants[name].tableName;
    //this.dynamicData.searchCondition = " inner join VendorUserMaster vm on vm.VendorId=VendorMaster.Vendorid" + this.constants[name].condition +" VendorCode is not null and " + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.dynamicData.searchCondition = "" + this.constants[name].condition + " VendorCode is not null and " + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    if (this.dynamicData.searchCondition && name == "venderid")
      this.dynamicData.searchCondition += " OR VendorCode" + " like '%" + searchTxt + "%' ";
    this.MprService.GetListItems(this.dynamicData).subscribe(data => {
      if (data.length == 0)
        this.showList = false;
      else
        this.showList = true;
      this.searchresult = data;
      this.searchItems = [];
      var fName = "";
      this.searchresult.forEach(item => {
        if (name == "venderid" && item["VendorCode"] != null) {
          fName = item[this.constants[name].fieldName] + " - " + item["VendorCode"];
          var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
          this.searchItems.push(value);
        }
        else {
          fName = item[this.constants[name].fieldName];
          var value = { listName: name, name: fName, code: item[this.constants[name].fieldId], updateColumns: item[this.constants[name].updateColumns] };
          this.searchItems.push(value);
        }
      });

    });
  }

  //search list option changes event
  public onSelectedOptionsChange(item: any, index: number) {
    this.showList = false;
    this.selectedEmailList = [];
    if (item.listName == "venderid") {
      this.ASNInitiate.VendorId = item.code;
      this.ASNInitiate.VendorName = item.name;
      this.vendorEmailList = item.updateColumns.split(",");
    }
  }

  //clear model when search text is empty
  onsrchTxtChange(modelparm: string, value: string, model: string) {
    if (value == "") {
      this[model][modelparm] = "";
    }
  }

  selectEmails(event: any, email: any, index: number) {
    var index = this.selectedEmailList.indexOf(email);
    if (index > -1)
      this.selectedEmailList.splice(index, 1);
    //if (event.target.checked == true) {
    //(<HTMLInputElement>document.getElementById("email" + index)).checked = false;
    //this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Only one mail is selected at a time' });
    //return true;
    //}
    if (event.target.checked) {
      //this.ASNInitiate.VendorEmailId = email;
      this.selectedEmailList.push(email);
    }
    //else {
    //  this.ASNInitiate.VendorEmailId = "";
    //  this.selectedEmailList = [];
    //}
  }

  //Initiate ASN process to vendor
  InitiateASN() {
    if (this.VendorEmailId)
      this.selectedEmailList.push(this.VendorEmailId);
    this.ASNInitiate.VendorEmailId = this.selectedEmailList.toString();
    if (this.ASNInitiate) {
      if (!this.ASNInitiate.VendorName) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor Name' });
        return;
      }
      if (!this.ASNInitiate.VendorEmailId) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Select Vendor Email' });
        return;
      }
      if (!this.ASNInitiate.Remarks) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Enter Remarks' });
        return;
      }
    }
    this.ASNInitiate.InitiateFrom = this.employee.EmployeeNo;
    this.spinner.show();
    this.RfqService.InitiateASN(this.ASNInitiate).subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.ASNInitiate = new ASNInitiate();
        this.selectedEmailList = [];
        this.VendorEmailId = "";
        this.messageService.add({ severity: 'success', summary: 'Sucess Message', detail: 'ASN Initiated' });
      }
    });
  }

  dialogCancel(dialogName: string, openDialog: string) {
    this[dialogName] = false;
    this[openDialog] = true;
  }
}
