import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  id: any;

  private readonly _getAllCustomerUrl = SERVICE_URLS.GET_CUSTOMERS;

  private readonly _getCustomerDetailUrl = SERVICE_URLS.GET_CUSTOMER_DETAIL;
  private readonly _getCustomerStatusUrl = SERVICE_URLS.GET_CUSTOMER_STATUS;
  private readonly _download = SERVICE_URLS.DOWNLOAD;

  constructor(private _http: HttpClient) {}

  getCustomers(params: any) {
    return this._http.get(this._getAllCustomerUrl, { params });
  }

  setId(id: any) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getCustomerDetail(id: any) {
    return this._http.get([this._getCustomerDetailUrl, id].join('/'));
  }

  getCustomerStatus(params: any) {
    return this._http.get(this._getCustomerStatusUrl, { params });
  }

  editStatus(body: any, id: any) {
    return this._http.post([this._getCustomerStatusUrl, id].join('/'), body);
  }

  // download(): Observable<any> {
  //   return this._http.get<any>(this._download, {
  //     responseType: 'blob' as 'json',
  //     observe: 'response',
  //   });
  // }

  download() {
    return this._http.get(this._download);
  }
}
