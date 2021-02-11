export class MPR {
}

export class DynamicSearchResult {
  connectionString: string;
  columnNames: string;
  columnValues: string;
  tableName: string;
  updateCondition: string;
  searchCondition: string;
  query: string;
  sortBy: string;
}
export class searchParams {
  tableName: string;
  fieldName: string;
  fieldId: string;
  condition: string;
  fieldAliasName: string;
  updateColumns: string;
}
export class searchList {
  listName: string;
  code: string;
  name: string;
}
export class MPRDetail {
  RequisitionId: number;
  DocumentNo: string;
  DocumentDescription: string;
}
export class MPRItemInfoes {
  Itemdetailsid: number;
  Itemid: string;
  ItemId: string;
  RevisionId: number;
  ItemDescription: string;
  Quantity: string;
  UnitId: string;
  SaleOrderNo: string;
  SOLineItemNo: string;
  MfgPartNo: string;
  MfgModelNo: string;
  ReferenceDocNo: string;
  TargetSpend: string;
  RepeatOrderRefId: number;
  PONumber: number;
  PODate: Date;
  POPrice: string;
  PORemarks: string;
  Materialdescription: string;
  DeleteFlag: boolean;
  ProjectDefinition: string;
  WBS: string;
  SystemModel: string
}


export class MPRDocumentations {
  DocumentationId: number;
  RevisionId: number;
  DocumentationDescriptionId: number;
  DocumentationDescription: string
  NoOfSetsApproval: number;
  NoOfSetsFinal: number;
  MPRDocumentationDescription: any;
}
export class MPRDocument {
  MprDocId: number;
  RevisionId: number;
  ItemDetailsId: number;
  DocumentName: string;
  UploadedBy: string;
  UplaodedDate: Date
  Path: string;
  DocumentTypeid: number;
  VendorId: number;
  Deleteflag: boolean

}
export class MPRIncharge {
  InchargeId: number;
  RequisitionId: number;
  RevisionId: number;
  Incharge: string;
  CanClearTechnically: boolean = false;
  CanClearCommercially: boolean = false;
  CanReceiveMailNotification: boolean = false;
  UpdatedBy: string;
  UpdatedDate: Date;
  DeleteFlag: boolean

}
export class MPRCommunication {
  MPRCCId: number;
  RevisionId: number;
  Remarks: string = "";
  RemarksFrom: string;
  SendEmail: boolean = false;
  SetReminder: boolean = false;
  ReminderDate: Date;
  RemarksDate: Date;
  DeleteFlag: boolean;
  MPRReminderTrackings: Array<MPRReminderTracking> = [];
}
export class MPRAssignment {
  assignmentid: number;
  MprRevisionId: number;
  Employeeno: string;
  EmployeeName: string;
  Employee: Employee;
}
export class MPRReminderTracking {
  ReminderId: number;
  MPRCCId: number;
  MailTo: string;
  MailAddressType: string
  MailSentOn: Date;
  AcknowledgedOn: Date;
  AcknowledgementRemarks: string;
  DeleteFlag: string;
}

export class MPRItemDetail {

}
export class MPRStatusTrack {

}
export class MPRTargetedSpendSupportingDoc {

}
export class MPRVendorDetail {
  VendorDetailsId: number;
  RevisionId: number;
  Vendorid: number;
  VendorName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  RemovedBy: string;
  RemovedDate: Date;
  RemoveFlag: boolean
  VendorMaster: any;
}

export class VendorMaster {
  Vendorid: number;
  VendorCode: string;
  VendorName: string;
  Emailid: string;
  ContactNo: string;
  UpdatedBy: string;
}

export class mprRevision {

  MPRCommunications: Array<MPRCommunication> = [];
  MPR_Assignment: Array<MPRAssignment> = [];
  MPRDocumentations: Array<MPRDocumentations> = [];
  MPRDocuments: Array<MPRDocument> = [];
  MPRIncharges: Array<MPRIncharge> = [];
  MPRItemInfoes: Array<MPRItemInfoes> = [];
  MPRStatusTracks: MPRStatusTrack;
  MPRTargetedSpendSupportingDocs: MPRTargetedSpendSupportingDoc;
  MPRVendorDetails: Array<MPRVendorDetail> = [];
  MPRStatusTrackDetails: Array<any> = [];
  saleorderdeatils: SaleOrderDetails;
  MPRDetail: MPRDetail;
  RequisitionId: number;
  DepartmentId: number;
  ProjectManager: string;
  JobCode: string;
  JobName: string;
  GEPSApprovalId: string;
  SaleOrderNo: string;
  LineItemNo: string;
  ClientName: string;
  PlantLocation: string;
  BuyerGroupId: number
  TargetedSpendAmount: string;
  TargetedSpendRemarks: string;
  BoolPreferredVendor: boolean
  JustificationForSinglePreferredVendor: string;
  DeliveryRequiredBy: Date;
  IssuePurposeId: number;
  DispatchLocation: string;
  ScopeId: number;
  TrainingRequired: boolean = false;
  TrainingManWeeks: number;
  TrainingRemarks: string;
  BoolDocumentationApplicable: boolean = false;
  GuaranteePeriod: string;
  NoOfSetsOfQAP: number;
  InspectionRequired: boolean = false;
  InspectionRequiredNew: number;
  InspectionComments: string;
  InspectionRemarks: string;
  NoOfSetsOfTestCertificates: number;
  ProcurementSourceId: number;
  CustomsDutyId: number;
  ProjectDutyApplicableId: number;
  ExciseDutyReimbursableForBOs: boolean;
  SalesTaxReimbursableForBOs: boolean;
  VATReimbursableForBOs: boolean;
  ServiceTaxReimbursableForBOs: boolean;
  ExciseDutyReimbursableForBOsNew: number;
  SalesTaxReimbursableForBOsNew: number;
  VATReimbursableForBOsNew: number;
  ServiceTaxReimbursableForBOsNew: number;
  Remarks: string;
  PreparedBy: string;
  PreparedOn: Date;
  CheckedBy: string;
  CheckedName: string;
  CheckedOn: Date;
  CheckStatus: string;
  CheckerRemarks: string;
  ApprovedBy: string;
  ApproverName: string;
  ApprovedOn: Date;
  ApprovalStatus: string;
  ApproverRemarks: string;
  SecondApprover: string;
  SecondApproverName: string;
  SecondApprovedOn: Date;
  SecondApproversStatus: string;
  SecondApproverRemarks: string;
  ThirdApprover: string;
  ThirdApproverName: string;
  ThirdApproverStatus: string;
  ThirdApproverStatusChangedOn: Date;
  ThirdApproverRemarks: string;
  PurchaseDetailsReadBy: string;
  PurchaseDetailsReadOn: Date;
  PurchasePersonnel: string;
  PODate: Date;
  ExpectedDespatchDate: Date
  PurchasePersonnelsComments: string;
  TechDocsReceivedDate: Date;
  CommercialOfferReceivedDate: Date;
  OfferDetailsMailedBy: string;
  OfferDetailsMailedOn: Date;
  OfferDetailsViewedByCheckerOn: Date;
  OfferDetailsViewedByApproverOn: Date;
  MaterialReceiptDate: Date;
  Remarks1: string;
  EstimatedCost: string;
  PreviousPOPrice: string
  PurchaseTypeId: number;
  PreferredVendorTypeId: number;
  StatusId: number;
  PurchaseCost: string;
  RevisionNo: number;
  RevisionId: number;
  BoolValidRevision: boolean;
  MPRForOrdering: boolean;
  ORequestedon: Date;
  ORequestedBy: string;
  ORemarks: string;
  OCheckedBy: string;
  OCheckedName: string;
  OCheckedOn: Date;
  OCheckStatus: string;
  OCheckerRemarks: string;
  OApprovedBy: string;
  OApproverName: string;
  OApprovedOn: Date;
  OApprovalStatus: string;
  OApproverRemarks: string;
  OSecondApprover: string;
  OSecondApproverName: string;
  OSecondApprovedOn: Date;
  OSecondApproversStatus: string;
  OSecondApproverRemarks: string;
  OThirdApprover: string;
  OThirdApproverName: string;
  OThirdApproverStatus: string;
  OThirdApproverStatusChangedOn: Date;
  OThirdApproverRemarks: string;
  DeleteFlag: boolean;
  StorageLocation: string;
  soldtopartyname: string;
  shiptopartyname: string;
  Endusername: string;
  Enduser: string;
  shiptoparty: string;
  soldtoparty: string;
    MPRAssignNames: string;
    MPRBuyerGroup: MPRBuyerGroup;
}

export class SaleOrderDetails {
  soldtopartyname: string
  shiptopartyname: string;
  Endusername: string;
  shiptoparty: string;
  soldtoparty: string;
  Enduser: string;
}

export class MPRStatusUpdate {
  RevisionId: number;
  RequisitionId: number;
  PreparedBy: string;
  status: string = "Select";
  StatusId: number;
  Remarks: string;
  typeOfuser: string;
  BuyerGroupId: number;
  BuyerGroupName: string = "";
  EmployeeName: string = "";
  MPRAssignments: Array<MPRAssignment> = [];
}

export class mprFilterParams {
  ListType: string;
  DocumentNo: string;
  DocumentDescription: string;
  FromDate: string;
  ToDate: string;
  Status: string;
  PreparedBy: string = "";
  CheckedBy: string = "";
  ApprovedBy: string = "";
  SecOrThirdApprover: string = "";
  IssuePurposeId: string;
  JobCode: string;
  ItemDescription: string;
  DepartmentId: string;
  ORgDepartmentid: string;
  GEPSApprovalId: string;
  BuyerGroupId: string;
  AssignEmployee: string;
  MPRStatusId: string;
  PurchaseTypeId: string;
  mprStatusListId: any;
  PONO: string;
  PAID: string;
  typeOfUser: string;
}

export class MPRScope {
  ScopeId: number;
  Scope: string;
  BoolInUse: string;
}
export class MPRApprovers {
  EmployeeNo: string;
}

export class Employee {
  EmployeeNo: string;
  Name: string;
  OrgDepartmentId: number;
  OrgDepartmentName: string;
  DOL: Date;
  RoleId: number;
}
export class MPRBuyerGroup {
  BuyerGroupId: number;
  BuyerGroup: string;
    BoolInUse: boolean;
    BuyerManager: string;
}
export class MPRProcurementSources {
  ProcurementSourceId: number;
  ProcurementSource: string;
  BoolInUse: boolean;
}
export class Department {
  DepartmentId: number;
  Department: string;
  SecondApproverEmpNo: string;
  SecondApproverName: string;
  ThirdApproverEmpNo: string;
  ThirdApproverName: string;
  BoolInUse: boolean;
}


export class ProjectManager {
  EmployeeNo: string;
  Name: string;
}
export class AccessList {
  RoleId: number;
  RoleName: string;
  UpdatedBy; string;
  AccessNameID: number;
  AccessName: string;
  RoleAccessNameid: number;
  AccessNameStatus: boolean;
}

export class PoFilterParams {
  PONO: string;
  RFQNo: string;
  Materialdescription: string;
  VendorId: string;
  VendorName: string;
}

export class sendMailObj {
  Message: string;
  IncludeUrl: boolean;
  IncludeCredentials: boolean;
}
export class selectObj {
  constructor(public id: number, public name: string) { }
}

export class DeleteMpr {
  DeletedRemarks: string;
  Deletedby: string;
  RevisionId: number;
}

export class materialUpdate {
  Itemdetailsid: number;
  RevisionId: number
  Itemid: string;
  RFQItemsId: number;
  Materialdescription: string;
  MPRRevisionId: string;
}

export class VendorRegStatus {
  Status: string;
  Remarks: string;
}
export class VendorRegApprovalProcess {
  ProceesId: number;
  VendorName: string
  VendorId: number;
  VendorEmailId: string;
  IntiatedBy: string;
  IntiatedOn: Date
  IntiatorStatus: string;
  IntiatorRemarks: string
  CheckedBy: string
  CheckedOn: Date
  CheckerStatus: string;
  CheckerRemarks: string
  ApprovedBy: string
  ApprovedOn: Date
  ApprovalStatus: string
  ApproverRemarks: string
  Verifier1: string;
  Verifier2: string;
  VerifiedBy: string;
  VerifiedOn: Date;
  VerifiedStatus: string
  VerifierRemarks: string;
  FinanceApprover: string;
  FinanceApprovedOn: Date;
  FinanceApprovedStatus: string
  FinanceApprovedRemarks: string;
  VendorNoInSAP: string
  PaymentTerms: string;
  PaymentTermId: number;
  Onetimevendor: boolean;
  EvaluationRequired: boolean;
  PerformanceVerificationRequired: boolean;
  VendorType: boolean;
  IsExistVendor: boolean;
  ChangesFor: string;
  BuyerGroupId: string;
  BuyerGroupName: string;
}

export class DocDetailsList {
  ItemDetailsId: number;
  DocumentName: string;
  UploadedBy: string;
  UplaodedDate: Date
  DocumentTypeId: number;
  Deleteflag: boolean
  PhysicalPath: string;
  uniqueid: number;
}

export class VendorRegistration {
  NatureOfBusinessType: string;
  NaturOfBusiness: number;
  SpecifyNatureOfBusiness: string;
  VendorType: boolean;
  Email: string;
  AltEmail: string;
  PhoneExn: string;
  vendorId: number;
  Vendorid: number;
  VendorCode: string;
  UniqueId: number;
  Onetimevendor: boolean;
  EvaluationRequired: boolean;
  MSMERequired: boolean;
  ESI: string;
  PerformanceVerificationRequired: boolean
  VendorNoInSAP: string;
  RequestedOn: Date;
  VendorName: string;
  VendorAddress: string;
  PostalCode: string;
  City: string;
  Street: string;
  LocalBranchOffice: string;
  PhoneAndExtn: string;
  Fax: string;
  ContactPerson: string;
  Phone: string;
  ContactPersonForSales: string;
  PhoneNumberForSales: string;
  EmailIdForSales: string;
  AltEmailidForSales: string;
  ContactPersonForOperations: string;
  PhoneNumberForOperations: string;
  EmailIdForOperations: string;
  AltEmailidForOperations: string;
  ContactPersonForLogistics: string;
  PhoneNumberForLogistics: string;
  EmailIdForLogistics: string;
  AltEmailidForLogistics: string;
  ContactPersonForAccounts: string;
  PhoneNumberForAccounts: string;
  EmailIdForAccounts: string;
  AltEmailidForAccounts: string;
  HaveGST: boolean;
  GSTNo: string;
  NatureofBusiness: number;
  PANNo: string;
  CINNo: string;
  TanNo: string;
  PaymentTerms: string;
  PaymentTermId: number;
  street: string;
  BusinessArea: string;
  Mobile: string;
  EmailId: string;
  contPhone: string;
  BankDetails: string;
  BankerName: string;
  LocationOrBranch: string;
  AccNo: string;
  IFSCCode: string;
  PhysicalPath: string;
  DocumentTypeId: number;
  fileattach1: string;
  stateid: string;
  isDisabled: false;
  filedata: FormData;
  DocDetailsLists: Array<VendorDocDetailsList> = [];
  ppath: File;
  deleteId: string;
  AccountHolderName: string;
  State: string;
  StateId: number
  LocalBranch: string;
  IntiatedBy: string;
  InitiatorStatusChangedOn: Date;
  IntiatedName: string;
  IntiatorStatus: string;
  IntiatorRemarks: string;
  CheckedBy: string;
  CheckedOn: Date;
  CheckerStatus: string;
  CheckerRemarks: string;
  ApprovedBy: string;
  ApprovedOn: Date;
  ApprovalStatus: string;
  ApproverRemarks: string;
  Verifier1: string;
  Verifier2: string;
  VerifiedBy: string;
  VerifiedOn: Date;
  VerifiedStatus: string
  VerifierRemarks: string;
  FinanceApprover: string;
  FinanceApprovedStatus: string;
  FinanceApprovedOn: Date;
  FinanceApprovedRemarks: string;
  CheckerName: string;
  ApproverName: string;
  FinanceApproverName: string;
  initiateVendorName: string;
  initiateVendorEmailId: string;
  VerifierName: string;
  VUniqueId: string;
  CurrencyId: number;
  CurrencyName: string;
  SwiftCode: string = "";
  IncoTerms: string;
  Country: string;
}
export class vendorRegfilters {
  FromDate: Date;
  ToDate: Date;
  Vendorid: string;
  VendorName: string;
  IntiatedBy: string;
  IntiatorStatus: string = "";
  CheckedBy: string;
  ApprovedBy: string;
  VerifiedBy: string;
  SecondApprover: string;
  ThirdApprover: string;
  PreparedBY: string;
  CheckerStatus: string = "";
  ApprovalStatus: string = "";
  VerifiedStatus: string = "";
  FinanceApprovedStatus: string = "";
}

export class VendorDocDetailsList {
  VendorId: number;
  DocumentName: string;
  UploadedBy: string;
  UploadedOn: Date
  DocumentationTypeId: number;
  Deleteflag: boolean
  PhysicalPath: string;
  Id: number;
}
export class YILTermsGroup {
  TermGroupId: number;
  TermGroup: string;
  CreatedBy: string;
  CreatedDate: Date
  DeleteFlag: boolean;
  DeletedBy: string;
  DeletedDate: Date;
  YILTermsandConditions: Array<YILTermsandCondition> = [];
}

export class YILTermsandCondition {
  TermId: number;
  TermGroupId: number;
  BuyerGroupId: number;
  Terms: string;
  DisplayOrder: number;
  DefaultSelect: boolean;
  DeleteFlag: boolean;
  CreatedBy: string;
  CreatedDate: Date;
  DeletedBy: string;
  DeletedDate: Date;
}
export class ASNInitiate {
  InitiateFrom: string;
  VendorId: string;
  VendorName: string;
  VendorEmailId: string;
  Remarks: string;
}

export class ASNfilters {
  FromDate: string;
  ToDate: string;
  ASNNo: string;
  Vendorid: string
  VendorName: string;
  IntiatedBy: string;
  PONo: string;
}
