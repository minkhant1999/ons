import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
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
  code: string = '';
  role: string = '';

  constructor(private router: Router, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    this.data = navigation?.extras?.state?.['data'];
  }

  ngOnInit(): void {
    this.code = this.data.vmyCode;
    this.role = this.data.role;
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }
}
