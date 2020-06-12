import {AuthService} from '../service/auth-service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler)
  {
    // Get the auth token from the service.
    const authToken = this.authService.getToken();
    console.log('authToken',authToken)
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (authToken) {
        req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
    }

    // send cloned request with header to the next handler.
    return next.handle(req);
  }
}