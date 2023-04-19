import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticlesRO, ArticlesRespData } from 'src/app/models/article';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';
import { LoggedInUserData } from 'src/app/models/logged-in-user-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  articleList$?: Observable<ArticlesRespData[]>;
  user?: LoggedInUserData;
  private userSubs?: Subscription;


  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubs = this.authService.loggedInUser.subscribe(
      {next: (data: LoggedInUserData) => this.user = data}
      );
    this.articleList$ = this.articleService.getAllArticles().pipe(
      map((data: ArticlesRO) => data.articles)
    )
  }

  ngOnDestroy(): void {
    if(this.userSubs) {
      this.userSubs.unsubscribe();
    }
  }

  openArticle(slug: string) {
    this.router.navigate(['article', slug])
  }

}
