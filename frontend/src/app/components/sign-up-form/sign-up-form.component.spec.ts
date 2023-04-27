import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpFormComponent } from './sign-up-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;
  let mockUserService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockUserService = {
      userDataConfig: {
        usernameMinChar: 3,
        usernameMaxChar: 7,
        passwordMinChar: 4,
        passwordMaxChar: 5
      }
    }

    mockAuthService = jasmine.createSpyObj(['createUser'])
    mockRouter = jasmine.createSpyObj(['navigate'])

    await TestBed.configureTestingModule({
      declarations: [SignUpFormComponent],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the right parameters for input validation', () => {
    expect(component.passwordMinChar).toBe(mockUserService.userDataConfig.passwordMinChar);
    expect(component.passwordMaxChar).toBe(mockUserService.userDataConfig.passwordMaxChar);
    expect(component.usernameMinChar).toBe(mockUserService.userDataConfig.usernameMinChar);
    expect(component.usernameMaxChar).toBe(mockUserService.userDataConfig.usernameMaxChar);
  })

  it('saveUser() should call authService.createuser', () => {
    mockAuthService.createUser.and.returnValue(of(null))
    component.saveUser();

    expect(mockAuthService.createUser).toHaveBeenCalledTimes(1);
  })

  it('should have label elements for username, email, password', () => {
    const compiledComponent = fixture.debugElement.nativeElement;

    const usernameLabel: HTMLLabelElement = compiledComponent.querySelector('label[for="username"]');
    const passwordLabel: HTMLLabelElement = compiledComponent.querySelector('label[for="password"]');
    const emailLabel: HTMLLabelElement = compiledComponent.querySelector('label[for="email"]');

    expect(usernameLabel).toBeTruthy();
    expect(passwordLabel).toBeTruthy();
    expect(emailLabel).toBeTruthy();

    expect(usernameLabel.textContent).toBe('Username');
    expect(passwordLabel.textContent).toBe('Password');
    expect(emailLabel.textContent).toBe('E-mail address');
  });

  it('should have input elements for username, email, password', () => {
    const compiledComponent = fixture.debugElement.nativeElement;

    const usernameInput: HTMLInputElement = compiledComponent.querySelector('#username');
    const passwordInput: HTMLInputElement = compiledComponent.querySelector('#password');
    const emailInput: HTMLInputElement = compiledComponent.querySelector('#email');

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  it('should have a form and a registrate button', () => {
    const compiledComponent = fixture.debugElement.nativeElement;

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    const formElement: HTMLFormElement = compiledComponent.querySelector('form');

    expect(buttonElement).toBeTruthy();
    expect(formElement).toBeTruthy();

    expect(buttonElement.textContent).toBe('Registrate');
  });

  it('registrate button should not be clickable at start', () => {
    const compiledComponent = fixture.debugElement.nativeElement;

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    expect(buttonElement.disabled).toBeTruthy();
  })

  it('registrate button should be clickable, when all inputs are valid', () => {
    const compiledComponent = fixture.debugElement.nativeElement;
    let signUpForm = component.userSignUpForm
    signUpForm.controls['username'].setValue('John D');
    signUpForm.controls['password'].setValue('asdf');
    signUpForm.controls['email'].setValue('jd@email.com');
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    expect(buttonElement.disabled).toBeFalsy();
  });

  it('registrate button should not be clickable, when an input is invalid', () => {
    const compiledComponent = fixture.debugElement.nativeElement;
    let signUpForm = component.userSignUpForm
    signUpForm.controls['username'].setValue('John D');
    signUpForm.controls['password'].setValue('as');
    signUpForm.controls['email'].setValue('jd@email.com');
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('saveUser() should been called, when registrate button was clicked', () => {
    const compiledComponent = fixture.debugElement.nativeElement;
    let signUpForm = component.userSignUpForm
    signUpForm.controls['username'].setValue('John D');
    signUpForm.controls['password'].setValue('asdf');
    signUpForm.controls['email'].setValue('jd@email.com');
    fixture.detectChanges();

    const mockSaveFunction = spyOn(component, 'saveUser');

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    buttonElement.click();
    expect(mockSaveFunction).toHaveBeenCalled();
  });

  it('should call authService when registrate button was clicked', () => {
    const compiledComponent = fixture.debugElement.nativeElement;
    mockAuthService.createUser.and.returnValue(of(null));
    let signUpForm = component.userSignUpForm;
    signUpForm.controls['username'].setValue('John D');
    signUpForm.controls['password'].setValue('asdf');
    signUpForm.controls['email'].setValue('jd@email.com');
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = compiledComponent.querySelector('#submitSignUpButton');
    buttonElement.click();
    expect(mockAuthService.createUser).toHaveBeenCalledWith({
      username: 'John D',
      password: 'asdf',
      email: 'jd@email.com'
    });
  });

});
