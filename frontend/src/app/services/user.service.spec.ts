import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { UserRO, UserData } from '../models/user';
import { TableConfig } from '../models/table-config';
import { UpdateUser } from '../models/update-user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserInfo()', () => {

      it('getUserInfo() should return user info', () => {
        const userRO: UserRO = {
          user: {
            id: 1,
            username: 'Joe Doe',
            bio: '',
            email: 'joedoe@mail.com',
            token: 'sdfasfasdfaf423421',
            image: ''
          }
        };
        service.getUserInfo().subscribe((data) => {
          expect(data).toEqual(userRO);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}user`);
        expect(req.request.method).toBe('GET');
        req.flush(userRO);
      });

  })

  describe('updateUserInfo()', () => {

    it('should update user info', () => {
      const userUpdateData: UpdateUser = {
        username: 'Joe Billy Doe',
        bio: '',
        email: 'joedoe@mail.com',
        image: ''
      };
      const userRO: UserRO = {
        user: {
          id: 1,
          username: 'newues',
          bio: '',
          email: 'joedoe@mail.com',
          token: 'sdfasfasdfaf423421',
          image: ''
        }
      };
      service.updateUserInfo(userUpdateData).subscribe((data) => {
        expect(data).toEqual(userRO);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}user`);
      expect(req.request.method).toBe('PUT');
      req.flush(userRO);
    });

  })


  describe('getAllUsers()', () => {

      it('should return all users', () => {
        const users: UserData[] = [
          { id: 1, email: 'jd@test.com', username: 'John Doe', bio: '', token: 'asdfasdf', image: '' },
          { id: 2, email: 'jad@test.com', username: 'Jane Doe', bio: '', token: 'asdfasdf', image: '' },
        ];
        service.getAllUsers().subscribe((data) => {
          expect(data).toEqual(users);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}users`);
        expect(req.request.method).toBe('GET');
        req.flush(users);
      });

  })

  describe('deleteUser()', () => {

    it('should delete user', () => {
      const email = 'test@test.com';
      service.deleteUser(email).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}users/${email}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

  })

  it('should return user table config', () => {
    const expectedTableConfig: TableConfig = {
      cols: [
        { key: 'id', text: 'ID' },
        { key: 'username', text: 'Username' },
        { key: 'email', text: 'E-mail' },
        { key: 'bio', text: 'Bio' },
        { key: 'image', text: 'Image' },
      ],
      actions: {
        deleteButton: true,
        updateButton: false,
      },
    };
    const tableConfig = service.userTableConfig;
    expect(tableConfig).toEqual(expectedTableConfig);
  });

  it('should return user data config', () => {
    const expectedUserDataConfig = {
      usernameMinChar: 4,
      usernameMaxChar: 10,
      passwordMinChar: 6,
      passwordMaxChar: 10,
      bioMaxChar: 600,
      imagePattern: /^http[s]?:\/{2}[\w\.\/]+\.{1}jp[e]?g$/
    }
    const userDataConfig = service.userDataConfig;
    expect(userDataConfig).toEqual(expectedUserDataConfig);
  });

});
