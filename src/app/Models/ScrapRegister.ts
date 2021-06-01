import { NumberValueAccessor } from '@angular/forms';
import { Data } from '@angular/router';

export class ScrapRegisterMasterModel {
  employeeno: string;
  scrapid: number;
  TruckNo: string;
  DateOfEntry: string;
  DepartmentName: string;
  RequesterDepartmentID: number;
  RequestedBY: string;
  RequestedName: string;
  PreparedBY: string;
  PreparedName:string
  PreparedDate: string;
  ApprovalBy: string;
  ApprovalName: string;
  ApprovalDate: Date;
  ApprovalRemarks: string;
  Approvalstatus: string;
  Scraptype: string;
  SONO: string;
  SoDate: Date;
  Soupdatedby: string;
  Soupdateddate: Date;
  VATInvoiceno: string;
  VATInvoiceDate: Date;
  VATInvoiceupdatedby: string;
  VatInvoiceUpdatedDate: Date;
  VatInvoiceDocumentUploaded: string;
  GatePAssNo: string;
  GatePassDate: Date;
  GatePassupdateby: string;
  GatePassupdateddate: Date;
  GatePassDocumentUploaded: string;
  TaxInvoiceNo: string;
  TaxInvoiceDate: Date;
  TaxInvoiceUpdatedY: string;
  TaxInvoiceUpdatedDate: Date;
  TaxInvoiceDocumentUpdated: string;
  scrapitems: Array<ScrapItems> = [];
  Vendor: string;
  Vendorcode: string;
  ScrapStatusId: number;
  documents: Array<ScapRegisterDocumentModel> = [];
  scraptype: string;
  statustarck: Array<ScrapStatustarckModel> = [];
  verifiername: string;
  Verifier: string;
  VerifierRemarks: string;
  fundavailablewithvendor: number;
  fundavendorremarks: number;
}
export class ScrapItems {
  Id: number;
  Scratypeid: number;
  ItemId: string;
  Itemcode: string;
  PriceType: number;
  Qty: number;
  UnitPrice: number;
  UOM: string;
  BAsicPrice: number;
  Description: string;
  tcs: number;
  sgstamount: number;
  cgstamount: number;
  igstamount: number;
  TotalPrice: number;
  Scraptype: string;
  ScrapItemid: number;
}
export class ScapRegisterDocumentModel {
  scrapdocid: number;
  Scrapentryid: number;
  DocumentNAme: string;
  uploadedBy: string;
  UploadedDate: string;
  path: string;
  DocumentTypeId: number;
  DocumentType: string;
}
export class ScrapflowModel {
  Scrapflow: string;
  Incharge: string;
  createdby: string;
  Inchargename: string;
  Createddate: Date;
}
export class ScrapStatustarckModel {
  statusid: number;
  Status: string;
  scrapid: string;
  stausid: number;
}
export class scrapsearchmodel {
  scraptype: string;
  truckno: string;
  employeeno: string;
  scrapflow: string[];
  DepartmentId: number;
  DepartmentName: string;
  Vendorid: string;
  VendorName: string;
  Scraptype: string;
  scrapfrom: Date;
  scrapto: Date;
  scraptypepending: string;
  scraptypeapprove: string;
}

