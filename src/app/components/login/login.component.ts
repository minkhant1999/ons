import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BrowserDetectionService } from './browser-detection.service';
import { LoginServiceService } from './login-service.service';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from 'src/app/modules/service/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  browser!: string;
  showErrorMessage!: string;
  currentLang = 'vi';
  isRequestedOtp: boolean = false;

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
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(this.currentLang);
    });
    this.browser = this.browserDetectionService.getBrowserInfo();

    const backgroundUrl = 'url(/assets/image/Gradient.png)';
    const container = this.el.nativeElement.querySelector(
      '.background-container'
    );

    this.renderer.setStyle(container, 'backgroundImage', backgroundUrl);

    this.form = this.fb.group({
      vmycode: ['vmy123123', [Validators.required]],
      browser: [this.browser],
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
    if (this.form.status === 'VALID') {
      this.loading = true;
      const data = this.form.value;
      if (data.vmycode === 'vmy123123') {
        this.authService.saveTokens(
          '87834uu43iuwr89uf8ae237ei23u2id392803ioiu2398'
        );
        this.loading = false;
        this.router.navigate(['admin/app-statistic']);
      } else {
        this.loading = false;
        this.showErrorMessage = 'Your VMY doesn’t exist.';
        this.isRequestedOtp = true;
      }
    }
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  switchLanguage() {
    const newLang = this.currentLang === 'vi' ? 'en' : 'vi';
    this.languageService.switchLanguage(newLang);
    this.currentLang = newLang;
  }

  cancel() {
    this.isRequestedOtp = false;
  }
}
