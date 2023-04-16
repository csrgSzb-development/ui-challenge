import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggedInUserData } from '../models/logged-in-user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const userData: LoggedInUserData = JSON.parse(localStorage.getItem('userData')!);
    const token = localStorage.getItem('token');
    if (!userData && !token) {
      this.toastr.info('You must log in to do that...', 'Ooops!')
      return this.router.createUrlTree(['/login']);
    } else {
      return true;
    }
  }
}

