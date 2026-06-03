"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SearchForm from "@/components/SearchForm";
import Tabs from "@/components/Tabs";
import { TOP_PAGE_MOCK } from "@/Mock";

export default function TopPage() {
  // タブ切替は Tabs(HeadlessUI)が内部で持つ
  // ページネーションだけ親で state 保持(後で API 呼び出しトリガーに使う想定)
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <SearchForm
        onSearch={(params) => {
          console.log("search:", params);
        }}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <Tabs
          resultsCount={TOP_PAGE_MOCK.totalResults}
          recommendsCount={TOP_PAGE_MOCK.recommendArticles.length}
          resultsPanel={
            <>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-sm text-zinc-500">
                  {TOP_PAGE_MOCK.totalResults}件
                </p>
                <p className="text-sm text-zinc-400">新着順</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TOP_PAGE_MOCK.searchResults.map((article) => (
                  <ArticleCard
                    key={article.id}
                    variant="results"
                    title={article.title}
                    tags={article.tags}
                    author={article.author}
                    authorInitials={article.authorInitials}
                    date={article.date}
                    shared={article.shared}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={TOP_PAGE_MOCK.totalPages}
                onPageChange={setCurrentPage}
              />
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
