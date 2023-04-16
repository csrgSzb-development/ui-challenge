import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../models/login-user';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { UserData, UserRO } from '../models/user';
import { LoggedInUserData } from '../models/logged-in-user-data';
import { CreateUser } from '../models/create-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly LOGIN_URL = `${environment.apiUrl}login`;
  private readonly USERS_BASE_URL = `${environment.apiUrl}users`;
  private __loggedInUser: BehaviorSubject<LoggedInUserData | null> = new BehaviorSubject<LoggedInUserData | null>(null);

  get loggedInUser() {
    return this.__loggedInUser as Observable<LoggedInUserData>;
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) { }


  createUser(newUser: CreateUser): Observable<UserRO>{
    return this.http.post<UserRO>(this.USERS_BASE_URL, newUser).pipe(
      catchError(error => this.handleError(error, 'sign up')),
      tap((data: UserRO) => {
        if (data.user) {
          this.handleAuthentication(data.user)
        }
      })
    );
  };

  loginUser(loginUserData: LoginUser): Observable<UserRO> {
    return this.http.post<UserRO>(this.LOGIN_URL, loginUserData).pipe(
      catchError(error => this.handleError(error, 'login')),
      tap((data: UserRO) => {
        if (data.user) {
          this.handleAuthentication(data.user)
        }
      })
    )
  };

  private handleAuthentication(userData: UserData): void {
    let loggedInUser: LoggedInUserData = { email: userData.email, username: userData.username }
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userData', JSON.stringify(loggedInUser))
    this.__loggedInUser.next(loggedInUser);
  }

  private handleError(errorRes: HttpErrorResponse, process: string) {
    let errorsObject = errorRes.error.errors;
    if(errorsObject){
      let errorMessage = "Some problem occurs:";
      for (const key in errorsObject) {
        if (Object.prototype.hasOwnProperty.call(errorsObject, key)) {
          errorMessage  += ` ${errorsObject[key]}`;
        }
      }
      this.toastr.error(`${errorMessage}`, `Error during ${process}!`)
    } else {
      this.toastr.error(`${errorRes.error.message}`, `Error during ${process}!`)
    }
    return throwError(errorRes)
  }


  private clearUserData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.__loggedInUser.next(null);
  }

  autoLogin(): void {
    const userData: LoggedInUserData = JSON.parse(localStorage.getItem('userData')!);
    const token = localStorage.getItem('token');
    if (!userData && !token) {
      return;
    } else {
      this.__loggedInUser.next(userData);
    }
  }

  setLoggedInUser(userData: LoggedInUserData) {
    this.__loggedInUser.next(userData);
  }

  logout(): void {
    this.clearUserData();
  }

}
