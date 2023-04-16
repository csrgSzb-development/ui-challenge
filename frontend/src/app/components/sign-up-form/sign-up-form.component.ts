import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRO } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {

  passwordMinChar?: number;
  passwordMaxChar?: number;
  usernameMinChar?: number;
  usernameMaxChar?: number;
  userSignUpForm!: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.usernameMinChar = this.userService.userDataConfig.usernameMinChar;
    this.usernameMaxChar = this.userService.userDataConfig.usernameMaxChar;
    this.passwordMinChar = this.userService.userDataConfig.passwordMinChar;
    this.passwordMaxChar = this.userService.userDataConfig.passwordMaxChar;
    this.userSignUpForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(this.usernameMinChar), Validators.maxLength(this.usernameMaxChar)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinChar), Validators.maxLength(this.passwordMaxChar)])
    })
  }

  public saveUser(): void {
    const newUser = this.userSignUpForm.value;

    this.authService.createUser(newUser).subscribe({
      next: (data: UserRO)  => {
        this.toastr.success(`Registration was successfull!`, `Hello ${data.user.username}!`)
      },
      complete: () => {
        this.userSignUpForm.reset();
        this.router.navigate(['']);
      }
    });
  }

  get username() { return this.userSignUpForm.get('username') };
  get password() { return this.userSignUpForm.get('password') };
  get email() { return this.userSignUpForm.get('email') };
}


