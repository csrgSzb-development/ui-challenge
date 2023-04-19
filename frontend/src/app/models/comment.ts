import { UserData } from "./user";

export interface CreateComment {
  body: string;
}

export interface ArticleComment {
  author: UserData;
  body: any;
  created: number;
  id: number;
}

export interface CommentsRO {
  comments: ArticleComment[];
}
