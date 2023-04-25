import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { LoggedInUserData } from '../models/logged-in-user-data';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

describe('AuthGuardService', () => {
  let mockAuthService: any, mockToastrService: any, mockRouter: any;
  let authGuard: AuthGuardService;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {};
    mockToastrService = jasmine.createSpyObj(['info']);
    mockRouter = jasmine.createSpyObj(['createUrlTree']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        AuthGuardService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    authGuard = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });


  it('should return true if user is logged in', (done) => {
    const user: LoggedInUserData = { username: 'test user', email: 'testuser@mail.com' };
    mockAuthService.loggedInUser = of(user);

    authGuard.canActivate(dummyRoute, dummyState).subscribe(
      result => {
        expect(result).toBeTrue()
        done()
      }
    );
  });

  it('should return Urltree and use toastr if user is not logged in', (done) => {
    mockAuthService.loggedInUser = of(null);
    const urlTree = { url: '/login' } as any;
    mockRouter.createUrlTree.and.returnValue(urlTree);

    authGuard.canActivate(dummyRoute, dummyState).subscribe(
      result => {
        expect(result).toEqual(urlTree);
        expect(mockToastrService.info).toHaveBeenCalledWith('You must log in to do that...', 'Ooops!');
        done();
      }
    );
  });

});




