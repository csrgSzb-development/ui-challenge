import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggedInUserData } from 'src/app/models/logged-in-user-data';
import { UserData } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user?: LoggedInUserData;
  private userSubs?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubs = this.authService.loggedInUser.subscribe(
      {next: (data: LoggedInUserData) => this.user = data}
    );
  }

  ngOnDestroy(): void {
    if(this.userSubs) {
      this.userSubs.unsubscribe();
    }
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
