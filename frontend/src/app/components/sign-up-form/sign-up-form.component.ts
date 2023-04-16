import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {

  public userSignUpForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)])
  })

  get username() { return this.userSignUpForm.get('username') };
  get password() { return this.userSignUpForm.get('password') };
  get email() { return this.userSignUpForm.get('email') };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
  }

  public saveUser(): void {
    const newUser = this.userSignUpForm.value;

    this.authService.createUser(newUser).subscribe({
      next: (data: UserRO)  => {
        this.toastr.success(`Registration was successfull!`, `Hello ${data.user.username}!`)
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
          this.toastr.error(`${errorMessage}`, 'Error during registration!')
        } else {
          this.toastr.error(`${error.error.message}`, 'Error during registration!')
        }
      },
      complete: () => {
        this.userSignUpForm.reset();
        this.router.navigate(['']);
      }
    });
  }
}


