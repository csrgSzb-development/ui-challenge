import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if(token) {
      const modifiedRequest = request.clone({
        setHeaders: {
          authorization: `bearer ${token}`
        }
      })
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}
