import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateUser } from '../models/create-user';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserData, UserRO } from '../models/user';
import { Observable } from 'rxjs';
import { UpdateUser } from '../models/update-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_BASE_URL = `${environment.apiUrl}user`;
  private readonly USERS_BASE_URL = `${environment.apiUrl}users`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }


  createUser(newUser: CreateUser): Observable<UserRO>{
    return this.http.post<UserRO>(this.USERS_BASE_URL, newUser);
  };

  getUserInfo(): Observable<UserRO> {
    return this.http.get<UserRO>(this.USER_BASE_URL);
  };

  updateUserInfo(userUpdateData: UpdateUser): Observable<UserRO> {
    return this.http.put<UserRO>(this.USER_BASE_URL, userUpdateData);
  };

  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.USERS_BASE_URL);
  };

  deleteUser(email: string) {
    return this.http.delete(`${this.USERS_BASE_URL}/${email}`)
  }
}
