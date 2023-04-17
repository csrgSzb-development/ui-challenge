import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ArticleRO, ArticleRespData } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {

  article?: ArticleRespData;
  editedArticleBody: string[] = [];

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const articleSlug = this.activatedRoute.snapshot.params['slug'];
    if (articleSlug) {
      this.articleService.getArticleBySlug(articleSlug).subscribe({
        next: (data: ArticleRO) => {
          this.article = data.article;
          this.editedArticleBody = this.setArticleBody(this.article.body)
        },
        error: (err) => {
          this.toastr.info('Error occurs', 'Oops');
          this.router.navigate([''])
        },
      })
    }
  }


  private setArticleBody(body: string): string[]{
    return body.split('\n').filter(p=> p.length > 0)
  }

}
