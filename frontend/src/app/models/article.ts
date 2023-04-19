import { ArticleComment } from './comment';
import { CreateArticle } from './create-article';
import { UserData } from './user';




export interface ArticleData extends CreateArticle {
 	id: number;
	slug: string;
	created: number;
	updated: number;
	favorited: boolean;
	favoriteCount: number; //! bad prop name in backend interface - favorite<s>Count
}

export interface ArticleRespData extends ArticleData {
  comments: ArticleComment[];
}
export interface ArticlesRespData extends ArticleData {
  author: UserData;
}


export interface ArticleRO {
	article: ArticleRespData;
}

export interface ArticlesRO {
	articles: ArticlesRespData[];
	articlesCount: number;
}

