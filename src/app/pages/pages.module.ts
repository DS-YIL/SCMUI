import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AccessGroupComponent } from './Authorization/AccessGroup.component';
import { ConfirmationDialogComponent } from '../common/confirmationdialog/confirmation-dialog.component';
import { AuthorizationItemComponent } from './Authorization/AuthorizationItem.component';
import { ConfigComponent } from './Authorization/Config.component';
import { RoleAccessComponent } from './Authorization/RoleAccess.component';
//import { LoginComponent } from './Login/Login.component';
import { ViewAccessComponent } from './Authorization/ViewAccess.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { SavingsReportComponent } from './MPR/SavingsReport.component';
import { RFQFormComponent } from './RFQ/RFQForm.component'
import { RFQListComponent } from './RFQ/RFQList.component';
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProjectManagersComponent } from './MPR/Admin/ProjectManagers.component';
import { TermsAndConditionsComponent } from './MPR/Admin/TermsAndConditions.component';
import { CurrencyMasterComponent } from './MPR/Admin/CurrencyMaster.component';
import { UploadVendorComponent } from './MPR/Admin/UploadVendors.component';
import { VendorEmailComponent } from './MPR/Admin/VendorEmail.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component';
import { VendorQuotationViewComponent } from './RFQ/VendorQuotationView.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule, MatButtonModule, MatExpansionModule } from '@angular/material';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectfilterPipe } from '../common/selectfilter.pipe';
import { LoginComponent } from './Login/Login.component';
import { PurchaseAuthorizationDetailsComponent } from './purchase-authorization/PurchaseAuthorizationDetails.component';
import { purchasePaymentComponent } from './purchase-authorization/purchasePayment.component';
import { PurchaseAuthorizationComponent } from './purchase-authorization/purchase-authorization.component';
import { CreditAuthorizationComponent } from './purchase-authorization/CreditAuthorization.component';
import { purchasePaymentListComponent } from './purchase-authorization/purchasePaymentList.component';
import { AddSlabsComponent } from './purchase-authorization/AddSlabs.component'
import { MPRPAApproversListComponent } from './purchase-authorization/MPRPAApproversList.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MPRStatusChartComponent } from './Dashboard/MPRStatusChart.component';

import { PAReportListComponent } from './purchase-authorization/PAReportList.component';
import { PAIncompletedListComponent } from './purchase-authorization/PAIncompletedList.component';
import { TokuchuRequestComponent } from './purchase-authorization/Tokuchurequest.component';
import { TokuchuReqListComponent } from './purchase-authorization/TokuchuReqList.component'

import { VendorRegInitiateComponent } from './VendorRegistration/VendorRegInitiate'
import { VendorRegListComponent } from './VendorRegistration/VendorRegList'
import { VendorRegPendingListComponent } from './VendorRegistration/VendorRegPendingList.component'
import { VendorRegisterApproverComponent } from './VendorRegistration/VendorRegApprover.component'

import { MPRStatusReportsComponent } from './MPRReports/MPRStatusReports.component'
import { MPRWiseReportsComponent } from './MPRReports/MPRWiseReports.component'
import { MPRRequisitionWiseReportComponent } from './MPRReports/MPRRequisitionWiseReport.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProjectWiseReportsComponent } from './MPRReports/ProjectWiseReports.component'
import { ProjectDurationReportsComponent } from './MPRReports/ProjectDurationReports.component'
import { ASNInitiateComponent } from './ASN/ASNInitiate.compenent';
import { AsnViewComponent } from './ASN/ASNView.component';
import { AsnListComponent } from './ASN/ASNList.component';
import { PAStatusReportsComponent } from './MPRReports/PAStatusReports.component';
import { MSALineItemListComponent } from './purchase-authorization/msaline-item-list.component';
import { VendorListComponent } from './MPR/Admin/VendorList.component';
import { VendorInfoComponent } from './MPR/Admin/VendorInfo.component';
import { BGApplicableListComponent } from './BG/BGApplicableList.component';
import { BGViewComponent } from './BG/BGView.component';
import { BGListComponent } from './BG/BGList.component';
import { ScrapRegisterComponent } from './ScrapRegister/ScrapRegister.component'
import { ScrapRegisterListComponent } from './ScrapRegister/ScrapRegisterList.component'
import { ScrapflowComponent } from './ScrapRegister/Scrapflow.component'
import { ScrapRegisterTotalListComponent } from './ScrapRegister/ScrapRegisterTotalList.component'
import { CmmMonthlyperformaceReport1Component } from './MPRReports/cmm-monthlyperformace-report1.component';
import { MonthlyReport2Component } from './MPRReports/monthly-report2.component'
 import { POCreationComponent } from './purchase-authorization/POCreation.component'
import { POGenerationComponent } from './purchase-authorization/POGeneration.component'
import { POListComponent } from './purchase-authorization/POList.component'
import { MVJustificationComponent } from './MPR/Admin/mvjustification.component';
import { from } from 'rxjs';
import { ScrapRegisterReportComponent } from './ScrapRegister/scrap-register-report.component';
import { InsuranceReport } from './ASN/InsuranceReport.component';
//import { DAComponent } from './DA/DAcomponent'

//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    ListboxModule,
    DialogModule,
    FileUploadModule,
    TooltipModule,
    RadioButtonModule,
    InputSwitchModule,
    CheckboxModule,
    CalendarModule,
    DataViewModule,
    ToastModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmDialogModule,
    MatExpansionModule,
    NbMenuModule,
    MatAutocompleteModule,
    AutoCompleteModule,
    MatInputModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule,
    //NgbModule
  ],
  declarations: [
    PagesComponent,
    AccessGroupComponent,
    AuthorizationItemComponent,
    ConfigComponent,
    RoleAccessComponent,
    LoginComponent,
    ViewAccessComponent,
    MPRListComponent,
    SavingsReportComponent,
    RFQFormComponent,
    RFQListComponent,
    ApproversComponent,
    BuyerGroupsComponent,
    DepartmentComponent,
    ProcurementSourcesComponent,
    ScopesComponent,
    ProjectManagersComponent,
    TermsAndConditionsComponent,
    CurrencyMasterComponent,
    UploadVendorComponent,
    VendorEmailComponent,
    MPRPageComponent,
    GenerateRFQComponent,
    RFQComparisionComponent,
    VendorQuotationViewComponent,
    ConfirmationDialogComponent,
    SelectfilterPipe,
    PurchaseAuthorizationDetailsComponent,
    purchasePaymentComponent,
    PurchaseAuthorizationComponent,
    CreditAuthorizationComponent,
    purchasePaymentListComponent,
    AddSlabsComponent,
    MPRPAApproversListComponent,
    DashboardComponent,
    MPRStatusChartComponent,
    PAReportListComponent,
    PAIncompletedListComponent,
    TokuchuRequestComponent,
    TokuchuReqListComponent,
    VendorRegInitiateComponent,
    VendorRegListComponent,
    VendorRegPendingListComponent,
    VendorRegisterApproverComponent,
    MPRStatusReportsComponent,
    MPRWiseReportsComponent,
    MPRRequisitionWiseReportComponent,
    ProjectWiseReportsComponent,
    ProjectDurationReportsComponent,
    ASNInitiateComponent,
    AsnViewComponent,
    AsnListComponent,
    PAStatusReportsComponent,
    MSALineItemListComponent,
    VendorListComponent,
    VendorInfoComponent,
    BGApplicableListComponent,
    BGViewComponent,
    BGListComponent,
    ScrapRegisterComponent,
    ScrapRegisterListComponent,
    ScrapflowComponent,
    ScrapRegisterTotalListComponent,
    CmmMonthlyperformaceReport1Component,
    MonthlyReport2Component,
     POCreationComponent,
    POGenerationComponent,
    POListComponent,
    MVJustificationComponent,
    ScrapRegisterReportComponent,
    InsuranceReport,
    //DAComponent
  ],
  providers: [MessageService, ConfirmationService],
  entryComponents: [ConfirmationDialogComponent]
})
export class PagesModule {
}
