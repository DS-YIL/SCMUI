import { Injectable } from '@angular/core';
import { searchParams, AccessList } from '../Models/mpr';

@Injectable({
  providedIn: 'root'
})
export class constants {
  //local
 public url = 'http://localhost:49659/Api/';

  //test server
  //public url = 'http://10.29.15.68:90/Api/';
  //public Documnentpath = "http://10.29.15.68:90/SCMDocs/";
  //public vendorDocumentPath = "http://10.29.15.68:90/SCMDocs/";
  //public PADocumentPath = "http://10.29.15.68:90/PADocuments/";
  //public vscmurl = "http://10.29.15.68:92/api/api/Forgetpassword/";

  //live
  public accessTokenUrl = "http://10.29.15.183:90/token";
  //public url = 'http://10.29.15.183:90/Api/';
  public Documnentpath = "http://10.29.15.183:90/SCMDocs/";
  public vendorDocumentPath = "http://10.29.15.183:90/SCMDocs/";
  public PADocumentPath = "http://10.29.15.183:90/PADocuments/";
  public scrapdocumentpath = "http://10.29.15.183:90/ScrapDocuments/";
  public vscmurl = "http://vscm-1089815394.ap-south-1.elb.amazonaws.com/api/api/Forgetpassword/";

  public dateFormat = "dd/MM/yyyy";
  public dateFormatWithTime = "dd/MM/yyyy h:mm:ss a"
  public RequisitionId: string = "";
  public newMpr: boolean = false;
  public rfqValidDays: number = 7;
  public VendorReg_CMM_Approver: string = "080100";
  public VendorReg_Verifier1: string = "100142";
  public VendorReg_Verifier2: string = "080036";
  public VendorReg_Fin_Approver: string = "220373";

  //public vendorDocumentPath = "http://10.29.15.183:90/SCMDocs/";
  //public PADocumentPath = "http://49659/PADocuments/";
  //public scrapdocumentpath ="http://49659/scrapDocuments/"

  public DepartmentId: searchParams = { tableName: 'MPRDepartments', fieldId: 'DepartmentId', fieldName: 'Department', condition: " where BoolInUse=1 and ", fieldAliasName: "DepartmentName", updateColumns: "" };
  public ProjectManager: searchParams = { tableName: 'ProjectManagers', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where ", fieldAliasName: "ProjectManagerName", updateColumns: "" };
  public vendorProjectManager: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where Employee.EmployeeNo  in(select ProjectManager from MPRRevisions  where BoolValidRevision=1) and ", fieldAliasName: "ProjectManagerName", updateColumns: "" };
  public ClientName: searchParams = { tableName: 'CustomerMasterYGS', fieldId: 'CustomerId', fieldName: 'CustomerName1', condition: " where CustomerMasterTypeId=1 and ", fieldAliasName: "ClientName", updateColumns: "" };
  public BuyerGroupId: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerGroupId', fieldName: 'BuyerGroup', condition: " where ", fieldAliasName: "BuyerGroupName", updateColumns: "" };
  public ItemId: searchParams = { tableName: 'MaterialMasterYGS', fieldId: 'Material', fieldName: 'Materialdescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public UnitId: searchParams = { tableName: 'UnitMaster', fieldId: 'UnitId', fieldName: 'UnitName', condition: " where ", fieldAliasName: " where ", updateColumns: "" };
  public venderid: searchParams = { tableName: 'VendorMaster', fieldId: 'Vendorid', fieldName: 'VendorName', condition: " where  Deleteflag=1 and ", fieldAliasName: "", updateColumns: "Emailid" };
  public PurchaseTypeId: searchParams = { tableName: 'MPRPurchaseTypes', fieldId: 'PurchaseTypeId', fieldName: 'PurchaseType', condition: " where ", fieldAliasName: "PurchaseType", updateColumns: "" };
  public PreferredVendorTypeId: searchParams = { tableName: 'MPRPreferredVendorTypes', fieldId: 'PreferredVendorTypeId', fieldName: 'PreferredVendorType', condition: " where ", fieldAliasName: "PreferredVendorType", updateColumns: "" };
  public DispatchLocation: searchParams = { tableName: 'MPRDispatchLocations', fieldId: 'DispatchLocationId', fieldName: 'DispatchLocation', condition: " where ", fieldAliasName: "DispatchLocation", updateColumns: "" };
  public ScopeId: searchParams = { tableName: 'MPRScopes', fieldId: 'ScopeId', fieldName: 'Scope', condition: " where ", fieldAliasName: "Scope", updateColumns: " where " };
  public Buyermanagers: searchParams = { tableName: 'MPRBuyerGroups', fieldId: 'BuyerManager', fieldName: 'Buyername', condition: " where ", fieldAliasName: "Scope", updateColumns: " where " };
  public BuyerGroupMembers: searchParams = { tableName: 'MPRBuyerGroupMembers', fieldId: 'GroupMember', fieldName: 'EmployeeName', condition: " where ", fieldAliasName: "Scope", updateColumns: " where " };
  public ProcurementSourceId: searchParams = { tableName: 'MPRProcurementSources', fieldId: 'ProcurementSourceId', fieldName: 'ProcurementSource', condition: " where BoolInUse=1 and ", fieldAliasName: "ProcurementSource", updateColumns: "" };
  public CustomsDutyId: searchParams = { tableName: 'MPRCustomsDuty', fieldId: 'CustomsDutyId', fieldName: 'CustomsDuty', condition: " where ", fieldAliasName: "CustomDuty", updateColumns: "" };
  //public ProjectDutyApplicableId: searchParams = { tableName: 'MPRProjectDutyApplicable', fieldId: 'ProjectDutyApplicableId', fieldName: 'ProjectDutyApplicable', condition: "", fieldAliasName: "ProjectDutyApplicable", updateColumns: "" };
  public DocumentationDescriptionId: searchParams = { tableName: 'MPRDocumentationDescriptions', fieldId: 'DocumentationDescriptionId', fieldName: 'DocumentationDescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public PreparedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "CheckedName", updateColumns: "" };

  public CheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "CheckedName", updateColumns: "" };
  //public ApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: "Grade>'m2' and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public ApprovedBy: searchParams = { tableName: 'MPRApproversView', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where ", fieldAliasName: "ApproverName", updateColumns: "" };
  public Incharge: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where  DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public toEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public ccEmail: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public JobCode: searchParams = { tableName: 'MPRRevisions', fieldId: 'JobCode', fieldName: 'JobCode', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public ItemDescription: searchParams = { tableName: 'MPRItemInfo', fieldId: 'ItemDescription', fieldName: 'ItemDescription', condition: " where ", fieldAliasName: "", updateColumns: "" };
  public AssignEmployee: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where EmployeeNo in(select GroupMember from MPRBuyerGroupMembers) and DOL IS NULL and ", fieldAliasName: "", updateColumns: "" };
  public OCheckedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where Grade<'m2' and  employeeNo in (190271,220017,030011) and ", fieldAliasName: "CheckedName", updateColumns: "" };
  public OApprovedBy: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public OSecondApprover: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public OThirdApprover: searchParams = { tableName: 'Employee', fieldId: 'EmployeeNo', fieldName: 'Name', condition: " where employeeNo in (190271,220017,030011) and ", fieldAliasName: "ApproverName", updateColumns: "" };
  public MPRStatus: searchParams = { tableName: 'MPRStatus', fieldId: 'StatusId', fieldName: 'Status', condition: " where  ManualStatus=1 and BoolInUse=1 and UsedByYIL=1 and ", fieldAliasName: "", updateColumns: "" };
  public MPRStatusId: searchParams = { tableName: 'MPRStatus', fieldId: 'StatusId', fieldName: 'Status', condition: "  where ManualStatus=1 and BoolInUse=1 and UsedByYIL=1 and ", fieldAliasName: "", updateColumns: "" };
  public soldtoparty: searchParams = { tableName: 'SaleorderDetails', fieldId: 'soldtoparty', fieldName: 'soldtopartyname', condition: "  where  ", fieldAliasName: "soldtopartyname", updateColumns: "" }
  public Enduser: searchParams = { tableName: 'SaleorderDetails', fieldId: 'Enduser', fieldName: 'Endusername', condition: "  where Endusername != '' and ", fieldAliasName: "Endusername", updateColumns: "" }
  public shiptoparty: searchParams = { tableName: 'SaleorderDetails', fieldId: 'shiptoparty', fieldName: 'shiptopartyname', condition: "  where ", fieldAliasName: "shiptopartyname", updateColumns: "" }
  public verifier: searchParams = { tableName: 'scrapflow', fieldId: 'incharge', fieldName: 'Name', condition: "  where ", fieldAliasName: "", updateColumns: "" }
}

