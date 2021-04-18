import { NumberValueAccessor } from '@angular/forms';
import { Data } from '@angular/router';

export class ScrapRegisterMasterModel {
  TruckNo: string;
  DateOfEntry: string;
  DepartmentName: string;
  RequesterDepartmentID: number;
  RequestedBY: string;
  PreparedBY: string;
  PreparedDate: string;
  ApprovalBy: string;
  ApprovalDate: Date;
  ApprovalRemarks: string;
  Approvalstatus: string;
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
}
export class ScrapItems {
  Id: number;
  Scratypeid: number;
  ItemId: string;
  PriceType: number;
  Qty: number;
  UnitPrice: number;
  UOM: string;
  BAsicPrice: number;
  Description: string;
  tcs: number;
  sgstamount: number;
  cgstamount: number;
  igstamount:number;
}


