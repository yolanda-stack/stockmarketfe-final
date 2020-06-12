import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from "../user";
import { HeaderService } from "../../service/header.service";
import { AuthService } from '../../service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

constructor(private http: HttpClient,private headerService:HeaderService,private authService:AuthService) { }

register(user:User):Observable<any>{
  this.authService.setToken('')
  const url = `${environment.getBaseUrl('user')}/signup`;
  return this.http.post<any>(url,user);
}

}
