import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleData, ArticlesRO } from 'src/app/models/article';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  articleList$?: Observable<ArticleData[]>;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.articleList$ = this.articleService.getAllArticles().pipe(
      map((data: ArticlesRO) => data.articles)
    )
  }

  openArticle(slug: string) {
    this.router.navigate(['article', slug])
  }

}
