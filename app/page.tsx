"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SearchForm, { type SearchParams } from "@/components/SearchForm";
import Tabs from "@/components/Tabs";
import type {
  Article,
  RecommendArticle,
  RecommendListResponse,
  SearchResponse,
} from "@/types";

const PER_PAGE = 21;
const EMPTY_PARAMS: SearchParams = {
  title: "",
  dateFrom: "",
  dateTo: "",
  tags: [],
};

export default function TopPage() {
  const router = useRouter();

  // 検索結果タブの state
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>(EMPTY_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // タブの選択状態
  const [activeTab, setActiveTab] = useState(0);

  // みんなのおすすめタブの state
  const [recommendArticles, setRecommendArticles] = useState<
    RecommendArticle[]
  >([]);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  // 自分が共有済みの qiitaId 一覧(共有ボタンの「済み/共有する」切替用)
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set());

  async function fetchArticles(params: SearchParams, page: number) {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE),
      });
      if (params.title) qs.set("keyword", params.title);
      if (params.tags.length > 0) qs.set("tag", params.tags.join(","));
      if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
      if (params.dateTo) qs.set("dateTo", params.dateTo);

      const res = await fetch(`/api/qiita?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchResponse = await res.json();

      setArticles(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError("検索に失敗しました。しばらく時間を空けてお試しください。");
      setArticles([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecommends() {
    setRecommendLoading(true);
    setRecommendError(null);
    try {
      const res = await fetch("/api/recommend");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RecommendListResponse = await res.json();
      setRecommendArticles(data.items);

      // 自分が共有済みの qiitaId を sharedIds に同期
      // (リロード後も「☆済み」表示を維持するため)
      const mySharedIds = data.items
        .filter((item) => item.isOwn)
        .map((item) => item.id);
      setSharedIds(new Set(mySharedIds));
    } catch (err) {
      console.error(err);
      setRecommendError("おすすめ記事の取得に失敗しました。");
      setRecommendArticles([]);
    } finally {
      setRecommendLoading(false);
    }
  }

  // 初回マウント時に検索結果(新着)とおすすめ一覧を両方取得
  useEffect(() => {
    fetchArticles(EMPTY_PARAMS, 1);
    fetchRecommends();
  }, []);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
    setActiveTab(0);
    fetchArticles(params, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchArticles(searchParams, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async (qiitaId: string) => {
    // 既に共有済み(楽観的更新も含む)なら何もしない
    // 解除は DELETE(マイページの責務)なのでここでは処理しない
    if (sharedIds.has(qiitaId)) return;

    // 楽観的更新:即座に「☆済み」表示に切替
    setSharedIds((prev) => new Set(prev).add(qiitaId));

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qiitaId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // 未ログイン → ロールバックしてログイン画面へ
          setSharedIds((prev) => {
            const next = new Set(prev);
            next.delete(qiitaId);
            return next;
          });
          router.push("/login");
          return;
        }
        if (res.status === 409) {
          // 既に共有済み(他タブで共有された等)→ そのまま「済み」を維持
          return;
        }
        // その他のエラー → ロールバック
        setSharedIds((prev) => {
          const next = new Set(prev);
          next.delete(qiitaId);
          return next;
        });
        alert("共有に失敗しました。時間をおいて再度お試しください。");
        return;
      }

      // 成功 → みんなのおすすめタブを最新状態に更新
      await fetchRecommends();
    } catch (err) {
      console.error(err);
      setSharedIds((prev) => {
        const next = new Set(prev);
        next.delete(qiitaId);
        return next;
      });
      alert("共有に失敗しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <>
      <SearchForm onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <Tabs
          selectedIndex={activeTab}
          onChange={setActiveTab}
          resultsCount={totalCount}
          recommendsCount={recommendArticles.length}
          resultsPanel={
            <>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-sm text-zinc-500">{totalCount}件</p>
                <p className="text-sm text-zinc-400">新着順</p>
              </div>

              {loading ? (
                <p className="mt-8 text-center text-zinc-500">読み込み中…</p>
              ) : error ? (
                <p className="mt-8 text-center text-red-600">{error}</p>
              ) : articles.length === 0 ? (
                <p className="mt-8 text-center text-zinc-500">
                  該当する記事がありません
                </p>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        variant="results"
                        title={article.title}
                        tags={article.tags}
                        author={article.author}
                        authorInitials={article.authorInitials}
                        date={article.date}
                        externalUrl={article.url}
                        shared={sharedIds.has(article.id)}
                        onToggleShare={() => handleShare(article.id)}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          }
          recommendsPanel={
            <>
              <p className="mt-4 text-sm text-zinc-500">
                {recommendArticles.length}件
              </p>

              {recommendLoading ? (
                <p className="mt-8 text-center text-zinc-500">読み込み中…</p>
              ) : recommendError ? (
                <p className="mt-8 text-center text-red-600">
                  {recommendError}
                </p>
              ) : recommendArticles.length === 0 ? (
                <p className="mt-8 text-center text-zinc-500">
                  おすすめ記事がまだありません
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendArticles.map((article) => (
                    <ArticleCard
                      key={article.recommendId}
                      variant="recommends"
                      title={article.title}
                      tags={article.tags}
                      author={article.author}
                      authorInitials={article.authorInitials}
                      date={article.date}
                      externalUrl={article.url}
                      recommendedBy={article.recommendedBy}
                      recommendedByInitials={article.recommendedByInitials}
                    />
                  ))}
                </div>
              )}
            </>
          }
        />
      </main>
    </>
  );
}
