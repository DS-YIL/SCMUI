import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicSearchResult, mprRevision, MPRItemInfoes, MPRDocument, MPRVendorDetail, MPRDocumentations, MPRStatusUpdate, mprFilterParams, MPRBuyerGroup, MPRApprovers, ASNInitiate, ASNfilters } from '../Models/mpr';
import { constants } from '../Models/MPRConstants'
import { RfqItemModel, rfqFilterParams, rfqQuoteModel, QuoteDetails, RFQDocuments, RFQCommunication, RFQRevisionData, RfqItemInfoModel, PreviousPrice, RFQCurrencyMaster, RFQGenerateReminderMaster, ASNCommunication, InvoiceDetails } from '../Models/rfq';

@Injectable({
  providedIn: 'root'
})


export class RfqService {
  constructor(private http: HttpClient, private constants: constants) { }
  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  public url = this.constants.url;

  getRFQItems(MPRRevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQItems/' + MPRRevisionId);
  }

  updateVendorQuotes(vendorQuoteList: any, termsList: any, selectedDocList: any): Observable<any> {
    var Data = {
      RFQQuoteViewList: vendorQuoteList,
      TermsList: termsList,
      mprfqDocs: selectedDocList
    }
    return this.http.post<any>(this.url + 'RFQ/updateVendorQuotes', JSON.stringify(Data), this.httpOptions);
  }
  getRFQCompareItems(MPRRevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/getRFQCompareItems/' + MPRRevisionId);
  }
  statusUpdate(vendorList: any): Observable<any> {
    var Data = {
      RFQQuoteViewList: vendorList
    }
    return this.http.post<any>(this.url + 'RFQ/rfqStatusUpdate/', JSON.stringify(Data), this.httpOptions);
  }
  GetItemsByRevisionId(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetItemsByRevisionId/' + RevisionId);
  }
  GetRfqDetailsById(RevisionId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetRfqDetailsById/' + RevisionId);
  }
  updateRfqDocumentStatus(rfqDocs: RFQDocuments[]): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/updateRfqDocStatus/', rfqDocs, this.httpOptions);
  }
  GetUnitMasterList(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetUnitMasterList', this.httpOptions);
  }
  GetAllMasterCurrency(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetAllMasterCurrency', this.httpOptions);
  }
  InsertRfqItemInfo(rfqItem: RfqItemInfoModel): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<any>(this.url + 'RFQ/InsertRfqItemInfo/', rfqItem, httpOptions);
  }
  getRFQList(rfqFilterParams: rfqFilterParams): Observable<any[]> {
    return this.http.post<any[]>(this.url + 'RFQ/getRFQList/', rfqFilterParams, this.httpOptions);
  }
  GetRfqByVendorId(VendorId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/GetRfqByVendorId/' + VendorId);
  }
  //getallrfqlist(): Observable<any> {
  //	return this.http.get<any>(this.url + 'RFQ/getallrfqlist', this.httpOptions);
  //}
  UpdateVendorCommunication(rfqCommunication: RFQCommunication): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/UpdateVendorCommunication/', rfqCommunication, this.httpOptions);
  }
  addNewRevision(RfqRevisionId: number): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/addNewRfqRevision/', RfqRevisionId, this.httpOptions);
  }

  CreateRfq(rfqrevisiondata: RFQRevisionData): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/CreateRfq/', rfqrevisiondata, this.httpOptions);
  }

  DeleteRfqItemByid(RFQItemId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/DeleteRfqItemByid/' + RFQItemId);
  }

  DeleteRfqIteminfoByid(spliId: number): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/DeleteRfqIteminfoByid/' + spliId);
  }
  PreviouPriceUpdate(previousprice: MPRItemInfoes): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/PreviouPriceUpdate/', previousprice, this.httpOptions);
  }
  updateHandlingCharges(RfqItems: Array<RfqItemModel>): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/updateHandlingCharges/', RfqItems, this.httpOptions);
  }

  UpdateNewCurrencyMaster(RFQCurrencyMaster: RFQCurrencyMaster): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/UpdateNewCurrencyMaster/', RFQCurrencyMaster, this.httpOptions);
  }

  RemoveMasterCurrencyById(currencyId: number, DeletedBy: string): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/RemoveMasterCurrencyById/' + currencyId + '/' + DeletedBy);
  }

  SendRFQGeneratedEmail(RFQGenerateReminderMaster: RFQGenerateReminderMaster): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/SendRFQGeneratedEmail/', RFQGenerateReminderMaster, this.httpOptions);
  }

  //ASN

  getasnlist(data: ASNfilters): Observable<any> {
    return this.http.post<any>(this.url + 'ASN/getAsnList', data, this.httpOptions);
  }

  getAsnByAsnno(ASNId: any): Observable<any> {
    return this.http.get<any>(this.url + 'ASN/getAsnDetails/' + ASNId, this.httpOptions);
  }
  GetInvoiceDetails(InvoiceDetails: InvoiceDetails): Observable<any> {
    return this.http.post<any>(this.url + 'ASN/GetInvoiceDetails/', InvoiceDetails, this.httpOptions);
  }
  MergeInvoiceDocs(InvoiceDetails: InvoiceDetails): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'blob' as any };
    return this.http.post<any>(this.url + 'ASN/MergeInvoiceDocs/', InvoiceDetails, httpOptions);
  }

  updateASNComminications(ASNCommunication: ASNCommunication): Observable<any> {
    return this.http.post<any>(this.url + 'ASN/updateASNComminications/', ASNCommunication, this.httpOptions);
  }

  InitiateASN(ASNInitiate: ASNInitiate): Observable<any> {
    return this.http.post<any>(this.url + 'ASN/ASNInitiate', ASNInitiate, this.httpOptions);
  }

  UpdateUnMappedItem(ItemList: any, DocList: Array<MPRDocument>): Observable<any> {
    var data = {
      rfqItemModel: ItemList,
      mPRRFQDocuments: DocList
    }
    return this.http.post<any>(this.url + 'RFQ/MappedRfqMissedItem', JSON.stringify(data), this.httpOptions);
  }
  UpdateMapMPRDoctoRFQDoc(MPRDocument: any): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/MappedMPRDocumnetToRFQDocumnet', JSON.stringify(MPRDocument), this.httpOptions);
  }
  UnMapRFQDocumnet(MPRDocument: any): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/UNMappedRFQDocumnet', JSON.stringify(MPRDocument), this.httpOptions);
  }
  RecreateNewRfqRevision(revisionId: number, recreate: string): Observable<any> {
    return this.http.post<any>(this.url + 'RFQ/RecreateNewRfqRevision/' + revisionId + '/' + recreate, this.httpOptions);

  }
  IsExcelExported(): Observable<any> {
    return this.http.get<any>(this.url + 'RFQ/IsExcelExported', { responseType: 'blob' as 'json' });
  }
  
}
