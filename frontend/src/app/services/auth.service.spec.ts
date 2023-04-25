import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { CreateUser } from '../models/create-user';
import { UserRO } from '../models/user';
import { environment } from 'src/environments/environment';
import { LoginUser } from '../models/login-user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ToastrService, useValue: mockToastrService },
      ],
    });
    service = TestBed.inject(AuthService);
    mockToastrService = jasmine.createSpyObj(['error', 'success'])
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createUser() should return the new user', () => {
    const mockNewUser: CreateUser = {
      username: 'Test User',
      email: 'testuser@test.com',
      password: 'test'
    };
    const mockUserRO: UserRO = {
      user: {
        ...mockNewUser,
        id: 1,
        bio: '',
        image: '',
        token: 'qwertz1223456'
      }
    };

    service.createUser(mockNewUser).subscribe(response => {
      expect(response).toEqual(mockUserRO);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}users`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserRO);
  });

  it('loginUser() should return the user', () => {
    const mockLoginUser: LoginUser = {
      email: 'testuser@test.com',
      password: 'test'
    };
    const mockUserRO: UserRO = {
      user: {
        username: 'Test User',
        email: 'testuser@test.com',
        id: 1,
        bio: '',
        image: '',
        token: 'qwertz1223456'
      }
    };

    service.loginUser(mockLoginUser).subscribe(response => {
      expect(response).toEqual(mockUserRO);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUserRO);
  });




});
