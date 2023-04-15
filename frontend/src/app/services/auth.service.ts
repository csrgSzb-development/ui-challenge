import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../models/login-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators'
import { UserData, UserRO } from '../models/user';
import { UserService } from './user.service';
import { LoggedInUserData } from '../models/logged-in-user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = `${environment.apiUrl}login`;
  private __loggedInUser: BehaviorSubject<LoggedInUserData | null> = new BehaviorSubject<LoggedInUserData | null>(null);

  get loggedInUser() {
    return this.__loggedInUser as Observable<LoggedInUserData>;
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
          let loggedInUser: LoggedInUserData = { email: data.user.email, username: data.user.username }
          localStorage.setItem('token', data.user.token);
          localStorage.setItem('userData', JSON.stringify(loggedInUser))
          this.__loggedInUser.next(loggedInUser);
        }
      }
    ))
  };

  private clearUserData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.__loggedInUser.next(null);
  }

  public autoLogin(): void {
    const userData: LoggedInUserData = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    } else {
      if (localStorage.getItem('token')) {
        this.__loggedInUser.next(userData);
      }
    }
  }

  logout(): void {
    this.clearUserData();
  }

}
