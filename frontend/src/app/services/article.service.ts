import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private readonly ARTICLES_BASE_URL = `${environment.apiUrl}articles`

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get(this.ARTICLES_BASE_URL)
  }
}
