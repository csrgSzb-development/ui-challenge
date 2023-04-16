import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take, tap } from 'rxjs/operators';
import { UpdateUser } from 'src/app/models/update-user';
import { UserRO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  editMode: boolean = false;
  updateUserData!: UpdateUser;
  bioMaxChar?: number;
  usernameMinChar?: number;
  usernameMaxChar?: number;
  imagePattern?: RegExp;
  userUpdateForm!: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.bioMaxChar = this.userService.userDataConfig.bioMaxChar;
    this.usernameMinChar = this.userService.userDataConfig.usernameMinChar;
    this.usernameMaxChar = this.userService.userDataConfig.usernameMaxChar;
    this.imagePattern = this.userService.userDataConfig.imagePattern;
    this.userUpdateForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(this.usernameMinChar), Validators.maxLength(this.usernameMaxChar)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      image: new FormControl('', Validators.pattern(this.imagePattern)),
      bio: new FormControl('', Validators.maxLength(this.bioMaxChar)),
    })

    this.userService.getUserInfo().pipe(
      take(1),
      tap((data: UserRO) => {
        if(data) {
          this.updateUserData = {
            image:  data.user.image ? data.user.image : '',
            email: data.user.email,
            bio: data.user.bio,
            username: data.user.username
          }
          this.userUpdateForm.patchValue(this.updateUserData)
        }
      })
    ).subscribe()
  }

  switchMode() {
    this.editMode = !this.editMode;
  }

  onCancel() {
    this.switchMode();
    this.userUpdateForm.patchValue(this.updateUserData)
  }

  updateUser(): void {
    const updateUserData: UpdateUser = this.userUpdateForm.value;

    this.userService.updateUserInfo(updateUserData).subscribe({
      next: (data)  => {
        this.toastr.success(`Profile update was successfull!`, `OK`);
      },
      error: (error) => {
        let errorsObject = error.error.errors;
        if(errorsObject){
          let errorMessage = "Some problem occurs:";
          for (const key in errorsObject) {
            if (Object.prototype.hasOwnProperty.call(errorsObject, key)) {
              errorMessage  += ` ${errorsObject[key]}`;
            }
          }
          this.toastr.error(`${errorMessage}`, 'Error during update!')
        } else {
          this.toastr.error(`${error.error.message}`, 'Error during update!')
        }
      },
      complete: () => {
        this.switchMode();
        this.authService.setLoggedInUser({ username: updateUserData.username, email: updateUserData.email });
        this.router.navigate(['']);
      }
    });
  };

  get username() { return this.userUpdateForm.get('username') };
  get email() { return this.userUpdateForm.get('email') };
  get image() { return this.userUpdateForm.get('image') };
  get bio() { return this.userUpdateForm.get('bio') };

}

