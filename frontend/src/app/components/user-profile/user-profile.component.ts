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
  private updateUserData!: UpdateUser;
  bioMaxChar: number = 600


  userUpdateForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    image: new FormControl('', Validators.pattern(/^http[s]?:\/{2}[\w\.\/]+\.{1}jp[e]?g$/)),
    bio: new FormControl('', Validators.maxLength(this.bioMaxChar)),
  })

  get username() { return this.userUpdateForm.get('username') };
  get email() { return this.userUpdateForm.get('email') };
  get image() { return this.userUpdateForm.get('image') };
  get bio() { return this.userUpdateForm.get('bio') };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.authService.loggedInUser.pipe(
      take(1),
      tap( data => {
        console.log(data)
        this.userService.getUserInfo().pipe(
          take(1),
        ).subscribe({
          next: (data: UserRO) => {
            console.log(data.user)
            this.updateUserData = {
              image:  data.user.image ? data.user.image : '',
              email: data.user.email,
              bio: data.user.bio,
              username: data.user.username
            }
            this.userUpdateForm.patchValue(data.user)
          }
        })
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
    console.log(this.userUpdateForm.value);

    const updateUserData: UpdateUser = this.userUpdateForm.value;

    this.userService.updateUserInfo(updateUserData).subscribe({
      next: (data)  => {
        console.log(data)
        this.toastr.success(`Profile update was successfull!`, `OK`)
      },
      error: (error) => {
        console.dir(error.error);
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
      }
    });
  };


}

