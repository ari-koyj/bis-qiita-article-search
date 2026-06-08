// Qiita API から取得して正規化した記事情報
export type QiitaArticle = {
  id: string;
  title: string;
  url: string;
  tags: string[];
  author: string;
  authorInitials: string;
  date: string; // YYYY/MM/DD
};

// マイページに表示するおすすめ1件分(recommendレコード + 記事情報)
export type MyRecommend = {
  recommendId: string;
  qiitaId: string;
  // 記事取得に失敗した場合(記事削除・レート制限など)は null
  article: QiitaArticle | null;
};
