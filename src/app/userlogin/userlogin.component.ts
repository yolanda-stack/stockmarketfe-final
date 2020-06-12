import { Component, OnInit, Input  } from '@angular/core';
import { LoginService } from '../login.service'
import { Router }      from '@angular/router';
import { GlobalService } from '../../service/global.service';
import { Authresponse } from '../../service/authresponse';
import { AuthService } from '../../service/auth-service';
import { Login } from '../login';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {
  _username:string;
  _password:string;
  // login = new Login();
  pageMessage = '';

  constructor(public loginService:LoginService, 
              public router: Router,
              public globalService: GlobalService,
              public authresponse: Authresponse,
              public authservice: AuthService
    ) { }
  
  ngOnInit(): void {
    this.pageMessage = '';
  }

 onSubmit(value:any){
  console.log('onSubmit() done!');
  console.log(value);

  this.loginService.login(value).subscribe(res=>{
    console.log('aaaa');
    console.log(res);
    console.log(res.headers.get('token'));
    console.log(res.body.data.jwtToken);
    if(res.body.status===200){
      this.loginService.isLoggedIn = true;
      this.loginService.role = res.body.data.usertype;
      console.log(this.loginService.isLoggedIn);
      console.log(this.loginService.role)
      if(res.body.data.jwtToken!==null){
        let jwt_token = res.body.data.jwtToken;
        console.log(jwt_token);
        jwt_token = jwt_token.replace('Bearer ','')
        console.log(jwt_token);
        this.authservice.setToken(jwt_token)
      }
    }
    if(this.loginService.isLoggedIn){
      // If no redirect has been set, use the default
      let homeUrl = this.loginService.role==='ROLE_ADMIN'?'/importexcel':'/manageipo';
      let redirect = this.loginService.redirectUrl?this.router.parseUrl(this.loginService.redirectUrl):homeUrl;
      this.router.navigateByUrl(redirect)
    }
  },
  err => this.pageMessage = 'Username or Password is not correct!'
  )
 }
}



