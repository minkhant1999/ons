import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_URLS } from 'src/assets/app.config';

@Injectable({
  providedIn: 'root',
})
export class ImportDataService {
  private readonly _getAll = SERVICE_URLS.GET_ALL_IMPORT_FILE;
  private readonly _create = SERVICE_URLS.IMPORT_FILE;

  constructor(private http: HttpClient) {}

  getFile(params: any) {
    return this.http.get(this._getAll, { params });
  }

  deleteFile(id: any) {
    return this.http.delete([this._getAll, id].join('/'));
  }

  importExcel(paramas: any) {
    return this.http.post(this._create, paramas);
  }
}
