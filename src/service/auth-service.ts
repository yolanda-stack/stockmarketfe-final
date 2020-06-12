import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //  getAuthorizationToken() {
  //    return localStorage.getItem('JWT-Token');
  //  }
  private name:string = 'jwt-token'
    
    getToken():string {
      console.log('ccc');
      console.log(this.name);
    　return localStorage.getItem(this.name)
    }
    setToken(token:string):void{
      console.log('ddd');
      console.log(token);
    　localStorage.setItem(this.name,token)
    }
}
