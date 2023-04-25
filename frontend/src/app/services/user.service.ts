import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserData, UserRO } from '../models/user';
import { Observable, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UpdateUser } from '../models/update-user';
import { TableConfig } from '../models/table-config';
import { ErrorHandlerService } from './error-handler.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_BASE_URL = `${environment.apiUrl}user`;
  private readonly USERS_BASE_URL = `${environment.apiUrl}users`;

  private readonly _userTableConfig: TableConfig = {
    cols: [
      { key: "id", text: "ID" },
      { key: "username", text: "Username" },
      { key: "email", text: "E-mail" },
      { key: "bio", text: "Bio" },
      { key: "image", text: "Image" }
    ],
    actions: {
      deleteButton: true,
      updateButton: false
    }
  };

  private readonly _userDataConfig = {
    usernameMinChar: 4,
    usernameMaxChar: 10,
    passwordMinChar: 6,
    passwordMaxChar: 10,
    bioMaxChar: 600,
    imagePattern: /^http[s]?:\/{2}[\w\.\/]+\.{1}jp[e]?g$/
  };

  constructor(
    private http: HttpClient,
    private eHS: ErrorHandlerService,
    private toastr: ToastrService
  ) { }

  getUserInfo(): Observable<UserRO> {
    return this.http.get<UserRO>(this.USER_BASE_URL).pipe(
      catchError(error => this.eHS.handleError(error, 'fetch user data')),
    );
  };

  updateUserInfo(userUpdateData: UpdateUser): Observable<UserRO> {
    return this.http.put<UserRO>(this.USER_BASE_URL, userUpdateData).pipe(
      catchError(error => this.eHS.handleError(error, 'update')),
      tap((data) => this.toastr.success(`Profile update was successfull!`, `OK`) )
    );
  };

  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.USERS_BASE_URL).pipe(
      catchError(error => this.eHS.handleError(error, 'fetch users\' data')),
    );
  };

  deleteUser(email: string) {
    return this.http.delete(`${this.USERS_BASE_URL}/${email}`).pipe(
      catchError(error => this.eHS.handleError(error, 'delete user')),
      tap((data) => this.toastr.success('User was successfully deleted!', 'OK') )
    );
  };

  get userTableConfig() {
    return this._userTableConfig;
  };
  get userDataConfig() {
    return this._userDataConfig;
  };
}
