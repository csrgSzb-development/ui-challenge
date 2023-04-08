import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../models/login-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { UserData, UserRO } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = `${environment.apiUrl}login`;
  private __loggedInUser: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);

  get loggedInUser() {
    return this.__loggedInUser as Observable<UserData>;
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }


  loginUser(loginUserData: LoginUser): Observable<UserRO> {
    return this.http.post<UserRO>(this.LOGIN_URL, loginUserData).pipe(
      tap((data: UserRO) => {
        console.log(data)
        if (data.user) {
          let loggedInUser = data.user
          localStorage.setItem('token', loggedInUser.token);
          localStorage.setItem('userData', JSON.stringify({
            username: loggedInUser.username,
            email: loggedInUser.email
          }))
          this.__loggedInUser.next(loggedInUser);
        }
      }
    ))
  };

  private clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.__loggedInUser.next(null);
  }

}
