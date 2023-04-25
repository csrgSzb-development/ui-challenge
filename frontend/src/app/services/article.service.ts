import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'
import { CreateArticle } from '../models/create-article';
import { Observable, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ArticleData, ArticleRO, ArticlesRO } from '../models/article';
import { CreateComment } from '../models/comment';
import { ErrorHandlerService } from './error-handler.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly ARTICLES_BASE_URL = `${environment.apiUrl}articles`;

  private readonly _articleDataConfig = {
    titleMinChar: 4,
    titleMaxChar: 50,
    descriptionMinChar: 6,
    descriptionMaxChar: 80,
    tagMinChar: 3,
    tagMaxChar: 10,
    tagPattern: /^[A-Za-z]*$/
  };

  constructor(
    private http: HttpClient,
    private eHS: ErrorHandlerService,
    private toastr: ToastrService
  ) { }

  getAllArticles(): Observable<ArticlesRO> {
    return this.http.get<ArticlesRO>(this.ARTICLES_BASE_URL).pipe(
      catchError(error => this.eHS.handleError(error, 'fetch articles')),
    );
  };

  saveArticle(newArticle: CreateArticle): Observable<ArticleData> {
    return this.http.post<ArticleData>(this.ARTICLES_BASE_URL, newArticle).pipe(
      catchError(error => this.eHS.handleError(error, 'save article')),
      tap((data: ArticleData) => {
        this.toastr.success(`Article with \"${data.title}\" title was saved.`, 'Success!')
      })
    );
  };

  getArticleBySlug(slug: string): Observable<ArticleRO> {
    return this.http.get<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}`).pipe(
      catchError(error => this.eHS.handleError(error, 'loading')),
    );
  };

  updateArticle(updatedArticle: CreateArticle, slug: string): Observable<ArticleRO> {
    return this.http.put<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}`, updatedArticle).pipe(
      catchError(error => this.eHS.handleError(error, 'update article')),
      tap((data: ArticleRO) => {
        this.toastr.info(`The article with \"${data.article.title}\" title was updated.`, 'Success!')
      })
    );
  };

  deleteArticle(slug: string): Observable<{ raw: [] }> {
    return this.http.delete<{ raw: [] }>(`${this.ARTICLES_BASE_URL}/${slug}`).pipe(
      catchError(error => this.eHS.handleError(error, 'delete article')),
      tap(() => this.toastr.success(`Article was succesfully deleted!`, 'OK'))
    );
  };

  favoriteArticle(slug: string): Observable<ArticleRO> {
    return this.http.post<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/favorite`, {}).pipe(
      catchError(error => this.eHS.handleError(error, 'favorite article')),
    );
  };

  unFavoriteArticle(slug: string): Observable<ArticleRO> {
    return this.http.delete<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/favorite`, {}).pipe(
      catchError(error => this.eHS.handleError(error, 'unfavorite article')),
    );
  };

  saveComment(slug: string, comment: CreateComment): Observable<ArticleRO> {
    return this.http.post<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/comments`, comment).pipe(
      catchError(error => this.eHS.handleError(error, 'save comment')),
    );
  };

  getArticlesComments(slug: string) {
    return this.http.get(`${this.ARTICLES_BASE_URL}/${slug}/comments`).pipe(
      catchError(error => this.eHS.handleError(error, 'fetch comments')),
    );;
  };

  deleteComment(slug: string, commentId: number): Observable<ArticleRO> {
    return this.http.delete<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/comments/${commentId}`).pipe(
      catchError(error => this.eHS.handleError(error, 'delete comment')),
    );;
  }

  get articleDataConfig() {
    return this._articleDataConfig;
  }

}
