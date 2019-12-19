import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button'
import { ListboxModule } from 'primeng/listbox';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { AppComponent } from './app.component';
import { LoginComponent } from './Login/Login.component';
import { SideMenuComponent } from './Dashboard/SideMenu.component';
import { DashboardComponent } from './Dashboard/Dashboard.component';
import { MPRPageComponent } from './MPR/MPRPage.component';
import { MPRListComponent } from './MPR/MPRList.component';
import { GenerateRFQComponent } from './RFQ/GenerateRFQ.component';
import { RFQComparisionComponent } from './RFQ/RFQComparision.component';
import { VendorQuotationViewComponent } from './RFQ/VendorQuotationView.component';
import { ApproversComponent } from './MPR/Admin/Approvers.component';
import { BuyerGroupsComponent } from './MPR/Admin/BuyerGroups.component';
import { DepartmentComponent } from './MPR/Admin/Departments.component';
import { ProcurementSourcesComponent } from './MPR/Admin/ProcurementSources.component';
import { ScopesComponent } from './MPR/Admin/Scopes.component';
import { ProjectManagersComponent } from './MPR/Admin/ProjectManagers.component'
import { SidebarDirective } from './sidebar.directive';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfigComponent } from './Authorization/Config.component';
import { AccessGroupComponent } from './Authorization/AccessGroup.component';
import { AuthorizationItemComponent } from './Authorization/AuthorizationItem.component';
import { RoleAccessComponent } from './Authorization/RoleAccess.component';
import { ViewAccessComponent } from './Authorization/ViewAccess.component';
import { SelectfilterPipe } from './common/selectfilter.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './common/confirmationdialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideMenuComponent,
    DashboardComponent,
    MPRPageComponent,
    MPRListComponent,
    GenerateRFQComponent,
    RFQComparisionComponent,
    VendorQuotationViewComponent,
    ApproversComponent,
    BuyerGroupsComponent,
    DepartmentComponent,
    ProcurementSourcesComponent,
    ScopesComponent,
    ProjectManagersComponent,
    SidebarDirective,
    ConfigComponent,
    AccessGroupComponent,
    RoleAccessComponent,
    AuthorizationItemComponent,
    SelectfilterPipe,
    ViewAccessComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //ListViewModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    ConfirmDialogModule
  ],
  providers: [HttpClientModule, MessageService, ConfirmationService],
  entryComponents: [ConfirmationDialogComponent,],
  bootstrap: [AppComponent]
})
export class AppModule { }
