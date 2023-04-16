import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from 'src/app/models/login-user';
import { UserData, UserRO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)])
  })

  get password() { return this.loginForm.get('password') };
  get email() { return this.loginForm.get('email') };

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  public loginUser() {
    const loginDataObject: LoginUser = this.loginForm.value;

    this.authService.loginUser(loginDataObject).subscribe({
      next: (data: UserRO) => {
        this.toastr.success(`Welcome ${data.user.username}!`, 'Successfull login!')
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
          this.toastr.error(`${errorMessage}`, 'Error during login!')
        } else {
          this.toastr.error(`${error.error.message}`, 'Error during login!')
        }
      },
      complete: () => {
        this.loginForm.reset();
        this.router.navigate(['']);
      },
    })
  }

}
