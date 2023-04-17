import { UserData } from './user';


interface Comment {
  body: string;
}

export interface ArticleData {
  id: number;
	slug: string;
	title: string;
	description: string;
	body: string;
	tagList: string[];
	created?: number;
	updated?: number;
	favorited?: boolean;
	favoritesCount?: number;
}

export interface ArticleRespData extends ArticleData {
  author: UserData;
}
export interface ArticlesRespData extends ArticleData {
  comments: Comment[];
}

export interface CommentsRO {
	comments: Comment[];
}

export interface ArticleRO {
	article: ArticleRespData;
}

export interface ArticlesRO {
	articles: ArticlesRespData[];
	articlesCount: number;
}
