import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoggedInUserData } from 'src/app/models/logged-in-user-data';
import { TableConfig } from 'src/app/models/table-config';
import { UserData } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-users-page',
  templateUrl: './edit-users-page.component.html',
  styleUrls: ['./edit-users-page.component.scss']
})
export class EditUsersPageComponent implements OnInit, OnDestroy {

  userTableConfig?: TableConfig;
  loggedInUser?: LoggedInUserData;
  userList?: UserData[];
  private userSubs?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setUsersList();
    this.userTableConfig = this.userService.userTableConfig;
    this.userSubs = this.authService.loggedInUser.subscribe(
      (data: LoggedInUserData) => {
        this.loggedInUser = data;
        console.log(data);
      }
    )
  }

  ngOnDestroy(): void {
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    };
  }

  deleteUser(userToDelete: UserData) {
    if (userToDelete.email === this.loggedInUser?.email) {
      this.toastr.info('You can\'t delete yourself!', 'Ooops');
      return
    }
    if (confirm(`Really delete ${userToDelete.username}?`)) {
      this.userService.deleteUser(userToDelete.email).subscribe({
        complete: () => { this.setUsersList() }
      })
    }
  }

  private setUsersList() {
    this.userService.getAllUsers().subscribe({
      next: (data: UserData[]) => {
        const newUserlist = data.map(user => {
          const modUser = { ...user };
          if (modUser.bio) {
            modUser.bio = `${user.bio.slice(0, 50)} ...`
          }
          return modUser;
        })
        this.userList = newUserlist;
      }
    })
  }

}
