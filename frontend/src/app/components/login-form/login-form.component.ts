import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/models/login-user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  passwordMinChar?: number;
  passwordMaxChar?: number;

  loginForm!: FormGroup;

  get password() { return this.loginForm.get('password') };
  get email() { return this.loginForm.get('email') };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.passwordMinChar = this.userService.userDataConfig.passwordMinChar;
    this.passwordMaxChar = this.userService.userDataConfig.passwordMaxChar;
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(this.passwordMinChar), Validators.maxLength(this.passwordMaxChar)])
    })
  }

  loginUser() {
    const loginDataObject: LoginUser = this.loginForm.value;

    this.authService.loginUser(loginDataObject).subscribe({
      complete: () => {
        this.loginForm.reset();
        this.router.navigate(['']);
      }
    })
  }
}
