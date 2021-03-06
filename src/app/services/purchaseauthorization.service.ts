import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PADetailsModel, ItemsViewModel, DepartmentModel, painutmodel, padeletemodel, PAAuthorizationLimitModel, posearchmodel, statussearch, PAAuthorizationEmployeeMappingModel, PACreditDaysMasterModel, PACreditDaysApproverModel, mprpapurchasemodesmodel, mprpapurchasetypesmodel, mprpadetailsmodel, PAApproverDetailsInputModel, MPRPAApproversModel, PAReportInputModel, padocuments, TokuchuRequest, tokuchufilters, ReportInputModel, MSAMasterConfimationModel, msainputmodel, POMaster } from '../Models/PurchaseAuthorization';
import { constants } from '../Models/MPRConstants'
import { Employee } from '../Models/mpr';
import { SelectItem } from 'primeng/api';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ScrapRegisterMasterModel, ScrapItems, ScrapflowModel, scrapsearchmodel } from '../Models/ScrapRegister'

@Injectable({
  providedIn: 'root'
})


export class purchaseauthorizationservice {
  public itemvalues = [];

  private _datasource = new Subject<ItemsViewModel[]>();
  itemdat$ = this._datasource.asObservable();
  constructor(private http: HttpClient, private constants: constants) { }
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public url = this.constants.url;

  getRFQItems(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQItems/' + RevisionId);
  }
  LoadItems(details: PADetailsModel): Observable<ItemsViewModel[]> {
    return this.http.post<ItemsViewModel[]>(this.url + 'PA/GetItemsByMasterIDs', details, this.httpOptions);
  }
  ApproveItems(item: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetEmployeeMappings1', item, this.httpOptions);
  }

  Approve(details: PADetailsModel): Observable<ItemsViewModel[]> {
    return this.http.post<ItemsViewModel[]>(this.url + 'PA/GetEmployeeMappings', details, this.httpOptions);
  }

  LoadAllDepartments(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetAllMPRDepartments', this.httpOptions);
  }

  LoadSlabsByDepartmentID(deptID: number): Observable<any> {
    debugger;
    return this.http.get<any>(this.url + 'PA/GetSlabsByDepartmentID/' + deptID);
  }
  LoadAllemployees(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetAllEmployee', this.httpOptions);
  }
  LoadAllFunctionalMappings(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetAllPAFunctionalRoles', this.httpOptions);
  }
  InsertPAAuthorizationLimits(paauthorization: PAAuthorizationLimitModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertPAAuthorizationLimits', paauthorization, this.httpOptions);
  }
  InsertEmployeeMapping(employemapping: PAAuthorizationEmployeeMappingModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/CreatePAAuthirizationEmployeeMapping', employemapping, this.httpOptions);
  }
  InsertCreditMaster(credit: PACreditDaysMasterModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/CreatePACreditDaysmaster', credit, this.httpOptions);
  }
  GetAllCredits(): Observable<PAAuthorizationLimitModel[]> {
    return this.http.get<PAAuthorizationLimitModel[]>(this.url + 'PA/GetAllCredits', this.httpOptions);
  }
  InsertCreditApprovers(creditapprover: PACreditDaysApproverModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/AssignCreditdaysToEmployee', creditapprover, this.httpOptions);
  }
  LoadAllCreditDays(): Observable<PACreditDaysMasterModel[]> {
    return this.http.get<PACreditDaysMasterModel[]>(this.url + 'PA/GetAllCreditDays', this.httpOptions);
  }
  LoadAllMappedCredits(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetCreditSlabsandemployees', this.httpOptions);
  }
  LoadEmployeemappedPurchases(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetPurchaseSlabsandMappedemployees', this.httpOptions);
  }
  LoadEmployeemappedPurchasesBydeptid(mapping: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetPurchaseSlabsandMappedemployeesByDeptId', mapping, this.httpOptions);
  }
  LoadAllmprpapurchasemodes(): Observable<mprpapurchasemodesmodel[]> {
    return this.http.get<mprpapurchasemodesmodel[]>(this.url + 'PA/GetAllMprPAPurchaseModes', this.httpOptions);
  }
  LoadAllmprpapurchasetypes(): Observable<mprpapurchasetypesmodel[]> {
    return this.http.get<mprpapurchasetypesmodel[]>(this.url + 'PA/GetAllMprPAPurchaseTypes', this.httpOptions);
  }
  InsertPurchaseAuthorization(purchasedetails: mprpadetailsmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertPurchaseAuthorization', purchasedetails, this.httpOptions);
  }
  UpdatePurchaseAuthorization(purchasedetails: mprpadetailsmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdatePurchaseAuthorization', purchasedetails, this.httpOptions);
  }
  finalpa(purchasedetails: mprpadetailsmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/finalpa', purchasedetails, this.httpOptions);
  }
  LoadMprPADeatilsbyid(PID: number): Observable<mprpadetailsmodel> {
    return this.http.get<mprpadetailsmodel>(this.url + 'PA/GetMPRPADeatilsByPAID/' + PID, this.httpOptions);
  }

  LoadMprPAList(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetAllMPRPAList', this.httpOptions);
  }
  LoadAllmprBuyerGroups(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetAllMPRBuyerGroups', this.httpOptions);
  }
  RemovePACreditDaysApprover(mappingdata: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/RemovePACreditDaysApprover', mappingdata, this.httpOptions);
  }
  RemovePurchaseApprover(mappingdata: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/RemovePurchaseApprover', mappingdata, this.httpOptions);
  }
  RemoveMappedSlab(slabdata: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/RemoveMappedSlab', slabdata, this.httpOptions);
  }
  LoadVendorbymprdeptids(MPRItemDetailsid: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadVendorByMprDetailsId', MPRItemDetailsid, this.httpOptions);
  }
  loadAllmprpaapproverslist(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetAllApproversList', this.httpOptions);
  }

  getdata(data: any, data1: any) {
    debugger;
    this._datasource.next(data);
  }
  LoadmprApproverDetailsbySearch(inputsearch: PAApproverDetailsInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetMprApproverDetailsBySearch', inputsearch, this.httpOptions);
  }
  Updatepaapproverstatus(approvers: MPRPAApproversModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateMprpaApproverStatus', approvers, this.httpOptions);
  }
  getrfqtermsbyrevisionid(rfqrevisionid: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getrfqtermsbyrevisionsid1', rfqrevisionid, this.httpOptions);
  }
  InsertPAitems(paitem: ItemsViewModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertPaitems', paitem, this.httpOptions);
  }
  GetMprpadetailsBySearch(pofilters: PADetailsModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getMprPaDetailsBySearch', pofilters, this.httpOptions)
  }
  LoadAllVendors(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetAllvendorList', this.httpOptions);
  }
  LoadAllMappedSlabs(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetAllMappedSlabs', this.httpOptions);
  }
  loadpareport(report: PAReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetPaStatusReports', report, this.httpOptions)
  }
  RequestForApproval(approvers: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateApproverforRequest', approvers, this.httpOptions)
  }
  uploadpadocument(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'PA/uploadExcel', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  Deletepa(data: padeletemodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/DeletePAByPAid', data, this.httpOptions)
  }
  loadAllIncompltedpalist(model: painutmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadIncompletedPAlist', model, this.httpOptions)
  }
  DeletePADocument(documents: padocuments): Observable<any> {
    return this.http.post<any>(this.url + 'PA/DeletePADocument', documents, this.httpOptions)
  }
  GetTokuchuDetailsByPAID(PID: number, TokuchRequestid: number): Observable<mprpadetailsmodel> {
    return this.http.get<mprpadetailsmodel>(this.url + 'PA/GetTokuchuDetailsByPAID/' + PID + '/' + TokuchRequestid, this.httpOptions);
  }
  updateTokuchuRequest(data: TokuchuRequest, typeOfUser: string, revisionId: number): Observable<any> {
    return this.http.post<any>(this.url + 'PA/updateTokuchuRequest/' + typeOfUser + '/' + revisionId + '', data, this.httpOptions)
  }

  getTokuchuReqList(data: tokuchufilters): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getTokuchuReqList', data, this.httpOptions)
  }
  Getmprstatus(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetmprstatusReport', status, this.httpOptions)
  }
  Getmprstatuswise(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetMprstatuswisereport', status, this.httpOptions)
  }
  GetmprrequisitionReport(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetmprRequisitionReport', status, this.httpOptions)
  }
  getmprreportfilters(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetmprRequisitionfilters', this.httpOptions)
  }
  getmprstatusbydepartment(data: statussearch): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getmprstatusbydepartment', data, this.httpOptions)
  }
  loadprojectmanagersforreport(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/Loadprojectmanagersforreport', this.httpOptions)
  }
  GetProjectWisereport(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/Loadprojectcodewisereport', status, this.httpOptions)
  }
  GetProjectDurationWisereport(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadprojectDurationwisereport', status, this.httpOptions)
  }
  Loadjobcodes(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/Loadjobcodes', this.httpOptions)
  }
  Loadsaleorder(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/Loadsaleorder', this.httpOptions)
  }
  GETApprovernamesbydepartmentid(departmentid: number): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GETApprovernamesbydepartmentid/' + departmentid, this.httpOptions);
  }
  getPaValueReport(pofilters: PADetailsModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getPaValueReport', pofilters, this.httpOptions)
  }

  uploadMSADocument(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'PA/uploadMSA', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  UpdateMSAMasterConfirmation(MSAConfirmationModel: MSAMasterConfimationModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateMSAConfirmation', MSAConfirmationModel, this.httpOptions)
  }
  ClearMSAMasterConfirmation(MSAConfirmationModel: MSAMasterConfimationModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/ClearMSAConfirmation', MSAConfirmationModel, this.httpOptions)
  }
  getincotermmaster(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/getincotermmaster', this.httpOptions)
  }
  resettokuchu(tokuchuid: number): Observable<any> {
    return this.http.get<any>(this.url + 'PA/updatetokuchubyid/' + tokuchuid);
  }
  UpdateMsaprconfirmation(msainput: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateMsaprconfirmation', msainput, this.httpOptions)
  }
  getmsaprocesstrack(paid: number): Observable<any> {
    return this.http.get<any>(this.url + 'PA/getmsaprocesstrackbyId/' + paid)
  }
  InsertScrapItems(scrapmaster: ScrapRegisterMasterModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertScrapRregister', scrapmaster, this.httpOptions)
  }
  getscraplist(data: scrapsearchmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getscraplist', data, this.httpOptions)
  }
  getscrapitembyid(scrapid: number): Observable<any> {
    return this.http.get<any>(this.url + 'PA/getscrapitembyid/' + scrapid);
  }
  uploadscrapExcel(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'PA/uploadscrapExcel', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  uploadscrapfileExcel(formdata: FormData): Observable<any> {
    return this.http.post<any>(this.url + 'PA/uploadscrapfileExcel', formdata)
      .pipe(map(data => {
        return data;
      }))
  }
  Approvescraprequest(approve: ScrapRegisterMasterModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateScrapRequest', approve, this.httpOptions)
  }
  Updatescraprequest(approve: ScrapRegisterMasterModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/UpdateScrapRregister', approve, this.httpOptions)
  }
  InsertScarpflowIncharge(approve: ScrapflowModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertScarpflowIncharge', approve, this.httpOptions)
  }
  getscrapflowlist(): Observable<any> {
    return this.http.get<any>(this.url + 'PA/Getincharelist', this.httpOptions)
  }
  Getscrapitemdetails(itemcode: string): Observable<any> {
    return this.http.get<any>(this.url + 'PA/Getscrapitemdetails/' + itemcode)
  }
  getscraplistbysearch(input: scrapsearchmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getscraplistbysearch', input, this.httpOptions)
  }
  Getincharepermissionlist(input: scrapsearchmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/Getincharepermissionlist', input, this.httpOptions)
  }
  getauthorizescrapflowlist(employeeno: string): Observable<any> {
    return this.http.get<any>(this.url + 'PA/getauthorizescrapflowlist/' + employeeno)
  }
  GetCMMMonthlyPerformance1(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetCMMMonthlyPerformancereport1', status, this.httpOptions)
  }
  GetCMMMonthlyPerformance2(status: ReportInputModel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/GetCMMMonthlyreport2', status, this.httpOptions)
  }
  LoadPOItems(details: PADetailsModel): Observable<ItemsViewModel[]> {
    return this.http.post<ItemsViewModel[]>(this.url + 'PA/LoadItemsforpocreation', details, this.httpOptions);
  }
  LoadItemsForPOGeneration(PAId: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadItemsforpogeneration', PAId, this.httpOptions);
  }
  LoadItemsforpogenerationbasedonvendor(VendorId: any, PAId: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadItemsforpogenerationbasedonvendor/' + VendorId + '', PAId, this.httpOptions);
  }
  InsertPoitems(poitem: POMaster): Observable<any> {
    return this.http.post<any>(this.url + 'PA/InsertPOItems', poitem, this.httpOptions);
  }
  GetPolineItemsToExcel(revisionId: any): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetPolineItemsToExcel/' + revisionId, { responseType: 'blob' as 'json' });
  }
  getscrapRegisterReport(input: scrapsearchmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/getscrapRegisterReport', input, this.httpOptions)
  }
  GetpoitemsByPoId(revisionId: any): Observable<any> {
    return this.http.get<any>(this.url + 'PA/GetpoitemsByPoId/' + revisionId);
  }
  LoadPolist(posearch: posearchmodel): Observable<any> {
    return this.http.post<any>(this.url + 'PA/LoadPolist', posearch, this.httpOptions);
  }
  Updateprnoapproval(model: any): Observable<any> {
    return this.http.post<any>(this.url + 'PA/Updateprnoapproval', model, this.httpOptions)
  }
} 
