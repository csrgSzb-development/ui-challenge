import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ArticleRO, ArticleRespData } from 'src/app/models/article';
import { CreateComment } from 'src/app/models/comment';
import { LoggedInUserData } from 'src/app/models/logged-in-user-data';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {

  article?: ArticleRespData;
  editedArticleBody: string[] = [];
  user?: LoggedInUserData;
  private userSubs?: Subscription;
  isFavourited: boolean = false;
  addCommentMode: boolean = false;

  @ViewChild('commentForm') commentForm?: NgForm;

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userSubs = this.authService.loggedInUser.subscribe(
      { next: (data: LoggedInUserData) => this.user = data }
    );
    const articleSlug = this.activatedRoute.snapshot.params['slug'];
    if (articleSlug) {
      this.articleService.getArticleBySlug(articleSlug).subscribe({
        next: (data: ArticleRO) => {
          this.setArticleData(data.article);
        },
        error: (err) => {
          this.toastr.info('Error occurs', 'Oops');
          this.router.navigate(['']);
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }
  }

  // Favorite function

  onFavourite() {
    if (!this.isFavourited) {
      this.articleObsHandler(this.articleService.favoriteArticle(this.article!.slug));
    } else {
      this.articleObsHandler(this.articleService.unFavoriteArticle(this.article!.slug));
    }
    this.isFavourited = !this.isFavourited;
  }

  // Comment functions

  switchCommentForm() {
    this.addCommentMode = !this.addCommentMode;
  }

  onSubmitComment(form: NgForm) {
    const newComment: CreateComment = { body: form.value.commentBody };
    if(newComment) {
      this.articleObsHandler(this.articleService.saveComment(this.article!.slug, newComment));
    }
    this.onCancelComment();
  }

  onCancelComment() {
    this.commentForm?.reset();
    this.switchCommentForm();
  }

  onDeleteComment(commentId: number) {
    this.articleObsHandler(this.articleService.deleteComment(this.article!.slug, commentId));
  }

  // Helper functions

  private setArticleData(article: ArticleRespData) {
    this.article = article;
    this.editedArticleBody = this.setArticleBody(this.article.body);
  }

  private setArticleBody(body: string): string[] {
    return body.split('\n').filter(p => p.length > 0);
  }

  private articleObsHandler(artObs$: Observable<ArticleRO>) {
    artObs$.subscribe({
      next: (data: ArticleRO) => {
        this.setArticleData(data.article);
      },
      error: (err) => {
        this.toastr.info('Error occurs', 'Oops');
      }
    })
  }

}
