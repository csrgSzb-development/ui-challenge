import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('JwtInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        }
      ]
    })

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    localStorage.removeItem('token');

  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
  });

  it('should add an authorization header to the request if token is in LocalStorage', () => {
    const url = '/test';
    localStorage.setItem('token', '123456testtoken')
    httpClient.get(url).subscribe();

    const req = httpMock.expectOne(url);
    console.log(req.request.headers.has('authorization'));
    expect(req.request.headers.has('authorization')).toBe(true);
  });

  it('should not add an authorization header to the request if token is not in LocalStorage', () => {
    const url = '/test';
    httpClient.get(url).subscribe();

    const req = httpMock.expectOne(url);
    console.log(req.request.headers.has('authorization'));
    expect(req.request.headers.has('authorization')).toBeFalsy();
  });

});
