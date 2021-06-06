import { Component, Input, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { MPRBuyerGroup, searchList, DynamicSearchResult, MPRMVJustification,Employee } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';
import { RfqService } from 'src/app/services/rfq.service ';
import { constants } from 'src/app/Models/MPRConstants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mvjustification',
  templateUrl: './mvjustification.component.html'
})
export class MVJustificationComponent implements OnInit {

  constructor(private router: Router,private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, public MprService: MprService, public constants: constants) { }
  @ViewChild('dialog', { read: ElementRef, static: true })
  protected dialogElement: ElementRef;
  public employee: Employee;
  public BuyerGroupsAddForm; BuyerGroupsEditForm: FormGroup;
  public dataSaved: boolean;
  public buyerGrps: Array<MPRMVJustification> = [];
  public editbuyerGrps: MPRMVJustification;
  public addbuyerGrp: MPRMVJustification;
  public AddDialog: boolean;
  public EditDialog: boolean;
  public selectedItem: searchList;
  public searchItems: Array<searchList> = [];
  public dynamicSearchResult = new DynamicSearchResult();
  public selectedlist: Array<searchList> = [];
  public BGAddSubmitted: boolean;

  ngOnInit() {
    if (localStorage.getItem("Employee"))
      this.employee = JSON.parse(localStorage.getItem("Employee"));
    else
      this.router.navigateByUrl("Login");
    this.buyerGrps = [];
    this.editbuyerGrps = new MPRMVJustification();
    this.addbuyerGrp = new MPRMVJustification();
    this.BGAddSubmitted = false;
    this.loadBuyerGroups();

    this.BuyerGroupsAddForm = this.formBuilder.group({
      MVjustification: ['', [Validators.required]],
    });

    this.BuyerGroupsEditForm = this.formBuilder.group({
      MVjustification: ['', [Validators.required]],
    });
  }
  loadBuyerGroups() {
    this.MprService.getMPRMVJustification().subscribe(data => {
      this.buyerGrps = data;
    });
  }

  showDialogToAddBuyerGroup() {
    this.AddDialog = true;
  }

  onBuyerGroupAdd() {
    this.BGAddSubmitted = true;
    if (this.BuyerGroupsAddForm.invalid) {
      return
    }
    else {
      const bgAdd = this.BuyerGroupsAddForm.value;
      // localStorage.setItem("MVjustification", bgAdd.BuyerGroup);
      this.addBuyerGrps(bgAdd)
      this.AddDialog = false;
    }
  }

  addBuyerGrps(bg: MPRMVJustification) {
    bg.Createdby=this.employee.EmployeeNo;
    this.MprService.addMPRMVJustification(bg).subscribe(
      () => {
        this.dataSaved = true;
        this.loadBuyerGroups();
        this.BuyerGroupsAddForm.reset();
      });
  }

  Cancel() {
    this.AddDialog = false;
    this.EditDialog = false;
  }

  onRowEditInit(e: any, formName: string, details: MPRMVJustification, name: string) {
    this.editbuyerGrps = details;
    this.EditDialog = true;
  }

  onBuyerGroupUpdate() {
    if (this.BuyerGroupsEditForm.invalid) {
      return
    }
    else {
      this.editbuyerGrps.Createdby=this.employee.EmployeeNo;
      this.MprService.updateMPRMVJustification(this.editbuyerGrps).subscribe(
        () => {
          this.dataSaved = true;
          this.loadBuyerGroups();
          this.BuyerGroupsEditForm.reset();
        });
      this.loadBuyerGroups();
      this.EditDialog = false;
    }
  }

  public bindSearchListData(e: any, formName: string, name: string, searchTxt: string, callback: () => any): void {
    if (searchTxt == undefined)
      searchTxt = "";
    this.dynamicSearchResult.tableName = this.constants[name].tableName;
    this.dynamicSearchResult.searchCondition = "" + this.constants[name].condition + this.constants[name].fieldName + " like '%" + searchTxt + "%'";
    this.MprService.getDBMastersList(this.dynamicSearchResult).subscribe(data => {
    });
  }

}
