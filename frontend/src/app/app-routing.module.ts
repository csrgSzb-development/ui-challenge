import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { AuthGuardService } from './services/auth-guard.service';
import { EditUsersPageComponent } from './pages/edit-users-page/edit-users-page.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'signup', component: SignUpFormComponent},
  {path: 'my-profile', component: UserProfileComponent, canActivate: [AuthGuardService]},
  {path: 'edit-users', component: EditUsersPageComponent, canActivate: [AuthGuardService]},
  {path: 'new-article', component: ArticleFormComponent, canActivate: [AuthGuardService]},
  {path: 'article/:slug', component: ArticleFormComponent, canActivate: [AuthGuardService]},
  {path: "**", redirectTo: ''}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
