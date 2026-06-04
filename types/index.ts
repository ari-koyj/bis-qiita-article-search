// 画面で扱う記事の型(Qiita API のレスポンスを整形したもの)
export type Article = {
  id: string;
  title: string;
  url: string;
  tags: string[];
  author: string;
  authorInitials: string;
  date: string;
};

// /api/qiita のレスポンス型
export type SearchResponse = {
  items: Article[];
  totalCount: number;
  totalPages: number;
};
