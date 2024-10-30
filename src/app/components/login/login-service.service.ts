import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  private readonly _login = SERVICE_URLS.LOGIN;

  constructor(private http: HttpClient) {}

  loginConfirm(params: any) {
    return this.http.post(this._login, { params });
  }
}
