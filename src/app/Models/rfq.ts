import { VendorMaster } from './mpr';

export class rfqQuoteModel {
  RFQSplitItemId: number;
  MPRItemDetailsid: number;
  Itemdetailsid: number;
  ItemId: number;
  ItemName: string;
  MaterialDescription: string;
  ItemDescription: string;
  TargetSpend: string;
  MprQuantity: string;
  QuotationQty: string;
  vendorQuoteQty: string;
  PaymentTermCode: string;
  Discount: string;
  UnitPrice: string;
  leastPrice: string;
  RfqDocStatus: string;
  Remarks: string;
  ActiveRevision: string;
  RateContract: number;
  PONumber: number;
  PODate: Date;
  POPrice: string;
  POUnitPrice: string;
  PORemarks: string;
  PONo: string;
  RFQNo: string;
  HSNCode: string;
  RFQType: string;
  suggestedVendorDetails: Array<any> = [];
  manualvendorDetails: Array<any> = [];
  repeatOrdervendorDetails: Array<any> = [];
  mappeditems: Array<mappingitems> = [];
  VendormappedDetails: Array<any> = [];
  mappingdoneitems: Array<any> = [];
}
export class RFQRevisionData {
  CreatedBy: number;
  CreatedDate: Date;
  RFQType: string;
  QuoteValidFrom: Date;
  QuoteValidTo: Date;
  RfqValidDate: number;
  PackingForwading: string;
  ExciseDuty: string;
  salesTax: string;
  freight: string;
  Insurance: string;
  CustomsDuty: string;
  ShipmentModeId: number;
  PaymentTermDays: number;
  PaymentTermRemarks: string;
  BankGuarantee: string;
  DeliveryMinWeeks: number;
  DeliveryMaxWeeks: number;
  VendorVisibility: boolean;
  Remarks: string;
  rfqmaster: RFQMasters;
  rfqitem: Array<RfqItemModel> = [];
  sendemail: boolean;
  StatusId: number;
}

export class VendorDetails {
  Vendorid: string;
  VendorCode: string;
  VendorName: string;
  OldvendorCode: string;
  RFQNo: string;
  MPRRevisionId: string;
  RfqMasterId: string;
  VendorId: number;
  rfqRevisionId: number;
  RFQValidDate: Date;
  DeliveryMinWeeks: number;
  DeliveryMaxWeeks: number;
  RFQItemsId: number;
  MPRItemsDetailsId: number;
  VendorQuoteQty: string;
  UnitPrice: string;
  DiscountPercentage: string;
  Discount: string;
  PaymentTermDays: number;
  PaymentTermRemarks: string;
  BankGuarantee: string;
  Freight: string;
  FreightAmount: string;
  PFAmount: string;
  MaterialTotalPrice: string;
  HandlingChargesTotal: string;
  TotalPrice: string;
  Insurance: string;
  HandlingPercentage: string;
  ImportFreightPercentage: string;
  InsurancePercentage: string;
  DutyPercentage: string;
  HandlingAmount: string;
  ImportFreightAmount: string;
  InsuranceAmount: string;
  DutyAmount: string;
}
export class RfqItemInfoModel {
  RFQSplitItemId: number;
  RFQItemsId: number;
  StartQty: string;
  EndQty: string;
  Qty: string;
  UOM: string;
  UnitPrice: string;
  DiscountPercentage: string;
  Discount: string;
  CurrencyId: string;
  CurrencyValue: string;
  Remarks: string;
  DeliveryDate: Date;
  ValidFrom: Date;
  ValidTo: Date;
  Status: string;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: boolean;
  DeliveryDays: number;
  //item: RfqItemModel;
}
export class RFQMasters {
  RfqMasterId: number;
  MPRRevisionId: number;
  RFQNo: string;
  RFQUniqueNo: number;
  VendorId: number;
  VendorVisibility: boolean;
  CreatedBy: string;
  CreatedDate: Date;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: string;
  RFQRevisions: Array<RFQRevisionData> = [];
  Vendor: VendorMaster;
  ProcurementSourceId: number;
}
export class RFQCurrencyMaster {
  CurrencyId: number;
  CurrencyName: string;
  CurrencyCode: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  DeletedBy: string;
  DeletedDate: Date;
  DeleteFlag: boolean
  Isdeleted: boolean;
}
export class RFQUnitMasters {
  UnitID: number;
  UnitName: string;
  Isdeleted: boolean;
}
export class RfqItemModel {
  RFQItemsId: number;
  RFQRevisionId: number;
  MPRItemDetailsId: number;
  MRPItemsDetailsID: number;
  ItemId: string;
  ItemName: string;
  ItemDescription: string;
  QuotationQty: string;
  VendorModelNo: string;
  HSNCode: string;
  CustomDuty: string;
  FreightPercentage: string;
  FreightAmount: string;
  PFPercentage: string;
  PFAmount: string;
  IGSTPercentage: string;
  CGSTPercentage: string;
  SGSTPercentage: string;
  taxInclusiveOfDiscount: string;
  RequestRemarks: string;
  DeleteFlag: boolean;
  SyncDate: Date;
  SyncStatus: boolean;
  iteminfo: Array<RfqItemInfoModel> = [];
  RFQDocuments: Array<RFQDocuments> = [];
  RfqVendorBOM: Array<any> = [];
  MfgPartNo: string;
  MfgModelNo: string;
  ManufacturerName: string;
  HandlingPercentage: string;
  ImportFreightPercentage: string;
  InsurancePercentage: string;
  DutyPercentage: string;
}

export class rfqFilterParams {
  RFQType: string;
  typeOfFilter: string;
  FromDate: string;
  ToDate: string;
  RFQNo: string;
  venderid: string;
  DocumentNo: string;
}
export class QuoteDetails {
  CreatedDate: Date;
  RfqValidDate: Date;
  ActiveRevision: boolean;
  rfqmaster: RFQMaster;
  rfqitem: Array<RfqItemModel>;
  RFQTerms: Array<any>;
  mprIncharges: Array<any>;
  rfqCommunications: Array<any>;
  RFQDocs: Array<any>;
  RFQStatusTrackDetails: Array<any>;
}
export class RFQMaster {
  RfqMasterId: string;
  RfqNo: string;
  RFQNo: string;
  Vendor: VendorDetails;
  MPRRevisionId: string;
}

export class RFQCommunication {
  RfqCCid: number;
  RfqItemsId: number;
  RfqRevisionId: number;
  RemarksTo: string = "";
  RemarksFrom: string;
  RemarksDate: Date;
  Remarks: string;
  DeleteFlag: boolean;
}

export class rfqTerms {
  Terms: string;
  RFQrevisionId: string;
  VendorResponse: string;
  Remarks: string;
  termsList: Array<any> = [];
}
export class RFQDocuments {
  // RfqDocumentId: number;
  RfqDocId: number;
  RfqRevisionId: number;
  RfqItemsId: number;
  DocumentName: string;
  DocumentType: number
  Path: string;
  UploadedBy: string
  UploadedDate: Date;
  StatusRemarks: string;
  Status: string;
  Statusdate: Date
  StatusBy: string;
  DeleteFlag: boolean;
}
export class PreviousPrice {
  PONumber: number;
  PODate: Date;
  POPrice: string;
  PORemarks: string;
}
export class RFQGenerateReminderMaster {
  FrmEmailId: string;
  VendorId: number;
  rfqno: string;
  Reminder: boolean;

}

//ASN
export class AsnModels {
  PONo: string = "";
  InvoiceNo: string;
  InvoiceDate: Date;
  ASNNo: string;
  VendorName: string;
  ShipFrom: string;
  ShipTo: string;
  ShippingDate: Date;
  DeliveryDate: Date;
  FreightInvNo: number;
  TransporterName: string;
  BillofLodingNumber: string;
  IncotermLoc: string;
  IncoTerm: string = "";
  IncotermDescription: string;
  ModeOfTransport: string = "";
  DeliveryNote: string;
  TotalGrossWeight_Kgs: number;
  TotalNetWeight_Kgs: number;
  TotalVolume: string;
  Insurance: string;
  ASNItemDetails: Array<any> = [];
  VendorId: string;
  CreatedBy: string;
  Incoterm: string;
  HSNCode: string;
  InboundDeliveryNo: string;
  DocumentDate: string
  ASNCommunications: Array<any> = [];
  PONos: string;
}


export class ASNCommunication {
  ASNCCId: number;
  ASNId: number;
  PONo: string;
  RemarksFrom: string;
  RemarksDate: Date;
  Remarks: string;
  DeleteFlag: boolean;
}

export class InvoiceDetails {
  InvoiceId: number;
  InvoiceNo: string;
  ASNId: number;
  PONo: string;
  VendorId: string;
  CreatedDate: Date;
  CreatedBy: string;
  ModifiedDate: Date;
  ModifiedBy
  Remarks: string;
  LRRemarks: string;
  InvoiceDocuments: Array<InvoiceDocuments> = [];
}

export class InvoiceDocuments {
  DocumentId: string;
  InvoiceId: number;
  DocumentName: string;
  Path: string;
  DocumentTypeId: number;
  UploadedBy: string;
  UploadedDate: Date;
  IsDeleted: boolean
}
export class mappingitems {
  itemrevision: number;
  itemdescription: string;
  DocumentNo: string;
  previousitemdetails: string;
  Itemdetailsid: string;
  vendorname: string;
  VendorCode: string;
  city: string;
  postalcode: string;
  UnitPrice: string;
  DiscountPercentage: string;
  Discount: string;
  RFQSplitItemId: number;
  RfqMasterId: number;
  rfqRevisionId: number;
  RFQNo: string;
  RFQItemsId: string;
  itemid: string;
  mprquantiy: string;
  mprrevisionid: number;
  Duplicateitemid: string;
  Newitemrevision: string;
}
