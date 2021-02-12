import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subscription } from 'rxjs-compat';
import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Employee, DynamicSearchResult } from 'src/app/Models/mpr';
import { MprService } from 'src/app/services/mpr.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  currentUser: Employee;
  name: any;
  public picture1: string;
  public DashboardCnt: string;
  public dynamicData = new DynamicSearchResult();

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Logout' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private breakpointService: NbMediaBreakpointsService,
    private _usermanage: MprService, private route: ActivatedRoute, private router: Router) {
    //this.currentUser = this._usermanage.currentUserValue;
    // this.currentUser = JSON.parse(localStorage.getItem('Employee'));
    this._usermanage.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser) {
      console.log('Localstorage Value-' + this.currentUser.Name);
    }
    //this.name = this.currentUser[0].Name 
  }

  ngOnInit() {

    // console.log(name);
    // console.log(this.currentUser);

    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);
    console.log(this.user);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    this.getdashBoardCnt();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  getdashBoardCnt() {
    this.dynamicData = new DynamicSearchResult();
    this.dynamicData.query = "exec DashboardCnt_SP " + this.currentUser.OrgDepartmentId + ", " + this.currentUser.EmployeeNo + "";
    this._usermanage.getDBMastersList(this.dynamicData).subscribe(data => {
      this.DashboardCnt = data[0].checkerListCnt + data[0].ApproversListCnt + data[0].SingleVendorListCnt + data[0].PAListCnt + data[0].VendorRegInitiatorCnt + data[0].VendorRegChkerLstCnt + data[0].VendorRegApprvrLstCnt + data[0].VendorRegFinVerLstCnt + data[0].VendorRegFinApprvLstCnt + data[0].TokuchuPreverLstCnt + data[0].TokuchuverLstCnt + data[0].MSALstCnt;
      document.getElementById("dashBrdcount").innerHTML = this.DashboardCnt;
      
    })
  }

  navigateDashboard() {
    this.router.navigateByUrl('/SCM/Dashboard');
  }
  // navigateHome() {
  //   this.menuService.navigateHome();
  //   return false;
  // }


}
