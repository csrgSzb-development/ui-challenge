import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'
import { CreateArticle } from '../models/create-article';
import { Observable } from 'rxjs';
import { ArticleData, ArticleRO, ArticlesRO } from '../models/article';
import { CreateComment } from '../models/comment';

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
  }

  constructor(
    private http: HttpClient
  ) { }

  getAllArticles(): Observable<ArticlesRO> {
    return this.http.get<ArticlesRO>(this.ARTICLES_BASE_URL);
  }

  saveArticle(newArticle: CreateArticle): Observable<ArticleData> {
    return this.http.post<ArticleData>(this.ARTICLES_BASE_URL, newArticle);
  }

  getArticleBySlug(slug: string): Observable<ArticleRO> {
    return this.http.get<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}`);
  }

  updateArticle(updatedArticle: CreateArticle, slug: string): Observable<ArticleRO> {
    return this.http.put<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}`, updatedArticle);
  }

  deleteArticle(slug: string): Observable<{raw: []}> {
    return this.http.delete<{raw: []}>(`${this.ARTICLES_BASE_URL}/${slug}`);
  }

  favoriteArticle(slug: string):  Observable<ArticleRO> {
    return this.http.post<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/favorite`, {});
  }

  unFavoriteArticle(slug: string): Observable<ArticleRO> {
    return this.http.delete<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/favorite`, {});
  }

  saveComment(slug: string, comment: CreateComment): Observable<ArticleRO> {
    return this.http.post<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/comments`, comment);
  }

  getArticlesComments(slug: string) {
    return this.http.get(`${this.ARTICLES_BASE_URL}/${slug}/comments`);
  }

  deleteComment(slug: string, commentId: number): Observable<ArticleRO> {
    return this.http.delete<ArticleRO>(`${this.ARTICLES_BASE_URL}/${slug}/comments/${commentId}`);
  }

  get articleDataConfig() {
    return this._articleDataConfig;
  }

}
