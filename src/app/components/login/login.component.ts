import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BrowserDetectionService } from './browser-detection.service';
import { LoginServiceService } from './login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiLoadingComponent } from 'src/app/modules/custom/model/loading/api-loading.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  otp!: FormGroup;
  loading: boolean = false;
  browser!: string;
  showErrorMessage!: string;
  currentLang = 'en';
  isRequestedOtp: boolean = false;
  transId: string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private browserDetectionService: BrowserDetectionService,
    private _loginServiceService: LoginServiceService,
    private cookieService: CookieService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(this.currentLang);
    });
    this.browser = this.browserDetectionService.getBrowserInfo();

    this.form = this.fb.group({
      vmyCode: ['', [Validators.required]],
      requestId: [new Date().toISOString(), [Validators.required]],
      requestTime: [new Date().toISOString(), [Validators.required]],
    });

    this.otp = this.fb.group({
      otpTransId: [''],
      otp: ['', [Validators.required]],
      requestId: [new Date().toISOString()],
      requestTime: [new Date().toISOString()],
    });

    this.pageReload();
  }

  pageReload() {
    const reloaded = sessionStorage.getItem('reloaded');

    if (!reloaded) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }

  onSubmit() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.loading = true;
    let params = this.form.value;

    this._loginServiceService.login(params).subscribe((data: any) => {
      if (data.errorCode === '00000') {
        loadingRef.close();
        this.loading = false;
        this.isRequestedOtp = true;
        this.transId = data.result.otpTransId;
      } else {
        loadingRef.close();
        this.loading = false;
        this.showErrorMessage = data.message;
      }
    });
  }

  login() {
    const loadingRef = this.dialog.open(ApiLoadingComponent, {
      disableClose: true,
    });
    this.loading = true;
    let params = this.otp.value;
    params.otpTransId = this.transId;

    this._loginServiceService.confirmLogin(params).subscribe((res: any) => {
      if (res.errorCode === '00000') {
        loadingRef.close();
        this.loading = false;
        this.authService.saveTokens(res.result.token);
        this.cookieService.set(
          'vmyCode',
          (res.result.data.vmyCode)
        );
        this.cookieService.set('role', (res.result.data.role));
        this.router.navigate(['admin/app-statistic'], {
          state: { data: res.result.data },
        });
      } else {
        loadingRef.close();
        this.loading = false;
        this.showErrorMessage = res.message;
      }
    });
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  isOtpValid(): boolean {
    return this.otp.valid;
  }

  cancel() {
    this.isRequestedOtp = false;
    this.showErrorMessage = '';
    this.form.value.vmycode = '';
    this.isFormValid();

    window.location.reload();
  }
}
