import { TestBed } from '@angular/core/testing';
import { ArticleService } from './article.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleData, ArticleRO, ArticlesRO } from '../models/article';
import { environment } from 'src/environments/environment';
import { CreateArticle } from '../models/create-article';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService],
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllArticles() should return all articles', () => {
    const mockArticlesResponse: ArticlesRO = {
      articlesCount: 1,
      articles: [
        {
          id: 1,
          body: 'This is the body of an article',
          description: 'This is the description of an article',
          title: 'Article One',
          slug: 'article-one',
          tagList: ['tag1', 'tag2'],
          created: new Date().getDate(),
          favoriteCount: 1,
          favorited: true,
          updated: new Date().getDate(),
          author: {
            id: 1,
            bio: '',
            email: 'johndoe@mail.com',
            username: 'John Doe',
            token: 'fasfasfasdf213213'
          }
        }
      ]
    };
    service.getAllArticles().subscribe((data) => {
      expect(data).toEqual(mockArticlesResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}articles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticlesResponse);
  });

  it('saveArticle() should return the new saved article', () => {
    const mockNewArticle: CreateArticle = {
      title: 'A New Article',
      description: 'This is a new article',
      body: 'This is the body of the new article',
      tagList: ['tag1', 'tag2']
    };
    const mockArticleData: ArticleData = {
      ...mockNewArticle,
      id: 1,
      slug: 'a-new-article',
      created: new Date().getDate(),
      updated: new Date().getDate(),
      favoriteCount: 0,
      favorited: false
    };

    service.saveArticle(mockNewArticle).subscribe(response => {
      expect(response).toEqual(mockArticleData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}articles`);
    expect(req.request.method).toBe('POST');
    req.flush(mockArticleData);
  });

  it('getArticleBySlug() should return the article', () => {
    const slug = 'article-one';
    const mockArticle: ArticleRO = {
      article: {
        id: 1,
        body: 'This is the body of an article',
        description: 'This is the description of an article',
        title: 'Article One',
        slug: 'article-one',
        tagList: ['tag1', 'tag2'],
        created: new Date().getDate(),
        favoriteCount: 1,
        favorited: true,
        updated: new Date().getDate(),
        comments: [{
          id: 1,
          body: 'This is a comment body',
          created: new Date().getDate(),
          author: {
            id: 1,
            bio: '',
            email: 'johndoe@mail.com',
            username: 'John Doe',
            token: 'fasfasfasdf213213'
          }
        }]
      }
    };

    service.getArticleBySlug(slug).subscribe(response => {
      expect(response).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}articles/${slug}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticle);
  });

  it('updateArticle() should return the updated article', () => {
    const slug = 'a-new-article';
    const mockUpdateArticle: CreateArticle = {
      title: 'An Updated New Article',
      description: 'This is a new article',
      body: 'This is the body of the new article',
      tagList: ['tag1', 'tag2']
    };
    const mockArticle: ArticleRO = {
      article: {
        ...mockUpdateArticle,
        id: 1,
        slug: 'an-updated-article',
        created: new Date().getDate(),
        updated: new Date().getDate(),
        favoriteCount: 0,
        favorited: false,
        comments: []
      }
    };

    service.updateArticle(mockUpdateArticle, slug).subscribe(response => {
      expect(response).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}articles/${slug}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockArticle);
  });

  it('deleteArticle() should return call the righ url', () => {
    const slug = 'a-new-article';

    service.deleteArticle(slug).subscribe(response => {
      expect(response).toEqual({ raw: [] });
    });
    const req = httpMock.expectOne(`${environment.apiUrl}articles/${slug}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ raw: [] });
  });

});


















