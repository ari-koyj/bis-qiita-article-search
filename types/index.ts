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

// おすすめ記事の型(Article に「誰が共有したか」を加えたもの)
export type RecommendArticle = Article & {
  recommendId: string; // Prisma Recommend.id(後で削除に使う)
  recommendedBy: string;
  recommendedByInitials: string;
  isOwn: boolean; // 現在のログインユーザーが共有したものか
};

// /api/recommend のレスポンス型
export type RecommendListResponse = {
  items: RecommendArticle[];
};
