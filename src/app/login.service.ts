import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GlobalService } from '../service/global.service';
import { HandleErrorService } from '../service/handleError.service';
import { HeaderService } from '../service/header.service';
import { catchError, retry } from 'rxjs/operators';
import { tap, delay } from 'rxjs/operators';
import { environment } from "../environments/environment";
import { User } from './user';
import { Login } from './login';

@Injectable({
  providedIn: 'root'
})


export class LoginService {

  isLoggedIn = false;
  role;//0:Admin;1:User
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  constructor(private http: HttpClient,private headerService:HeaderService) { }

  login(login:Login):Observable<any>{
    console.log('bbb');
    const url = `${environment.getBaseUrl('user')}/login`;
    console.log(url);
    console.log(login.username,login.password);
    return this.http.post<any>(url,login,{observe: 'response'});
  }

logout(): void {
  const url = `${environment.getBaseUrl('user')}/logout`;
  this.http.get(url).subscribe((res)=>{
    console.log(res)
    this.isLoggedIn = false;
  }
  );
}


  // readonly loginURL = `${environment.getBaseUrl('user')}/login`;

  // // Observable<any> 定义返回类型
  // public findUser(userloginForm: Login): Observable<any> {
  //     console.log('findUser() done!');
  //     console.log('loginUrl', this.loginURL);
  //     console.log('userloginForm', userloginForm);
  //     return this.http.post<any>(this.loginURL, userloginForm, this.headerService.httpOptions)
  //         .pipe(
  //             retry(1), // retry a failed request up to 1 times
  //             catchError(this.handleErrorService.handleError)
  //         );

  //     // const id = 1; // memory测试用
  //     // return this.http.get<any>(`api/users/${id}`); // memory测试用
  //     // // or直接用下面的
  //     // return this.http.get<any>('api/users/1'); // memory测试用
  // }

}
