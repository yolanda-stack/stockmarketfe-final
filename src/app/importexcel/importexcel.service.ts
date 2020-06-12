import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportExcelService {

constructor(private http: HttpClient) { }

  downloadExcel(){
    const url = `${environment.getBaseUrl('import')}/file/download`;
    window.location.href = url;
  }

  uploadExcel(fileData:any):any{
    const url = `${environment.getBaseUrl('import')}/file/upload`;
    console.log(fileData)
    return this.http.post(url,fileData);
  }

}
