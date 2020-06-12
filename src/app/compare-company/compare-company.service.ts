import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompareCompanyService {
  constructor(private http: HttpClient) { }

  generateChart(compareForm:any){
    console.log(compareForm)
    const url = `${environment.getBaseUrl('price')}/generate/comparison/{companyCode}`;
    return this.http.post<any>(url,compareForm);
  }

}
