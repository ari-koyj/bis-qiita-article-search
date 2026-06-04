"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SearchForm, { type SearchParams } from "@/components/SearchForm";
import Tabs from "@/components/Tabs";
import { TOP_PAGE_MOCK } from "@/Mock";
import type { Article, SearchResponse } from "@/types";

const PER_PAGE = 21;
const EMPTY_PARAMS: SearchParams = {
  title: "",
  dateFrom: "",
  dateTo: "",
  tags: [],
};

export default function TopPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>(EMPTY_PARAMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

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

  // 初回マウント時に新着記事を取得
  useEffect(() => {
    fetchArticles(EMPTY_PARAMS, 1);
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

  return (
    <>
      <SearchForm onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <Tabs
          selectedIndex={activeTab}
          onChange={setActiveTab}
          resultsCount={totalCount}
          recommendsCount={TOP_PAGE_MOCK.recommendArticles.length}
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
                        shared={false}
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
                {TOP_PAGE_MOCK.recommendArticles.length}件
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TOP_PAGE_MOCK.recommendArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    variant="recommends"
                    title={article.title}
                    tags={article.tags}
                    author={article.author}
                    authorInitials={article.authorInitials}
                    date={article.date}
                    recommendedBy={article.recommendedBy}
                    recommendedByInitials={article.recommendedByInitials}
                  />
                ))}
              </div>
            </>
          }
        />
      </main>
    </>
  );
}
