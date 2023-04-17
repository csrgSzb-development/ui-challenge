import { UserData } from './user';


interface Comment {
  body: string;
}

export interface ArticleData {
  id: number;
	slug: string;
	title: string;
	description: string;
	body?: string;
	tagList?: string[];
	created?: number;
	updated?: number;
	favorited?: boolean;
	favoritesCount?: number;
	author?: UserData;
  comments: Comment[]
}

export interface CommentsRO {
	comments: Comment[];
}

export interface ArticleRO {
	article: ArticleData;
}

export interface ArticlesRO {
	articles: ArticleData[];
	articlesCount: number;
}
