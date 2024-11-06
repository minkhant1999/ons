import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  data: any;
  collapsed = signal(false);
  isMobile = window.innerWidth <= 430;
  isLaptop = window.innerWidth <= 1024;

  sidenavWidth = computed(() => {
    if (this.isMobile) {
      return this.collapsed() ? '0px' : '150px';
    } else if (this.isLaptop) {
      return this.collapsed() ? '65px' : '160px';
    } else {
      return this.collapsed() ? '65px' : '210px';
    }
  });
  code = this.cookieService.get('vmyCode');
  role = this.cookieService.get('role');

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    if (this.isMobile || this.isLaptop) {
      this.collapsed = signal(true);
    }
  }

  logOut() {
    this.cookieService.delete('vmyCode');
    this.cookieService.delete('role');
    this.authService.logOut();
    this.router.navigate(['login']);
  }
}
