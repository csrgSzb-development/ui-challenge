import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserData, UserRO } from '../models/user';
import { Observable } from 'rxjs';
import { UpdateUser } from '../models/update-user';
import { TableConfig } from '../models/table-config';

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
  }


  constructor(
    private http: HttpClient
  ) { }

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
    return this.http.delete(`${this.USERS_BASE_URL}/${email}`);
  }

  get userTableConfig() {
    return this._userTableConfig;
  }
  get userDataConfig() {
    return this._userDataConfig;
  }
}
