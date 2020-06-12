import { Component, OnInit, Input } from '@angular/core';
import { Router }      from '@angular/router';
import { User } from '../user';
import { SignupService } from "./signup.service";
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-usersignup',
  templateUrl: './usersignup.component.html',
  styleUrls: ['./usersignup.component.css']
})
export class UsersignupComponent implements OnInit {
  signupMessage=''
  _username:string;
  _password:string;
  _email:string;
  isSignup:boolean = false;
  user=<User>{

  };

  constructor(
    public router: Router,
    private signupService:SignupService
    ) { }

  ngOnInit() {
  }

  onSubmit(value:any){
    this.signupService.register(value).subscribe(res=>{
      console.log(res)
      this.signupMessage = res.msg;
      //redirect to login page
      setTimeout(() => {this.redirect();},5000)
      
    })

  }
  redirect(){
    this.router.navigateByUrl('/userlogin')
  }
}
