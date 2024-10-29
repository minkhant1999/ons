import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/service/auth.service';
import { LanguageService } from '../service/language.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeComponent } from './model/password-change/password-change.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  currentLang = 'en';
  public code: string = 'VMY123123';
  public userName: string = 'Testing';
  collapsed = signal(false);
  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '320px'));

  constructor(
    private router: Router,
    private authService: AuthService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  changePassword() {
    this._dialog.open(PasswordChangeComponent, {
      disableClose: false,
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }
}
