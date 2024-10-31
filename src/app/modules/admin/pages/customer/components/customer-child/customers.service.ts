import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  id: any;

  private readonly _getAllCustomerUrl = SERVICE_URLS.GET_CUSTOMERS;

  private readonly _getCustomerDetailUrl = SERVICE_URLS.GET_CUSTOMER_DETAIL;

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
}
