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
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '240px'));
  code = this.cookieService.get('vmyCode');
  role = this.cookieService.get('role');

  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'];
  }

  ngOnInit(): void { }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }
}
