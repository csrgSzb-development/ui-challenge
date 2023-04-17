import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { JwtInterceptor } from './services/jwt.interceptor';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DataTableComponent } from './shared/data-table/data-table.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { EditUsersPageComponent } from './pages/edit-users-page/edit-users-page.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { ArticleDetailsComponent } from './components/article-details/article-details.component';



@NgModule({
  declarations: [
    AppComponent,
    SignUpFormComponent,
    LoginFormComponent,
    UserProfileComponent,
    DataTableComponent,
    NavbarComponent,
    HeaderComponent,
    HomeComponent,
    EditUsersPageComponent,
    ArticleFormComponent,
    ArticleDetailsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
      {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
