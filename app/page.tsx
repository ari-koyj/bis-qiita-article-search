"use client";

import Link from "next/link";
import { useState } from "react";

import { TOP_PAGE_MOCK } from "@/Mock";

export default function TopPage() {
  // タブ切替のみロジックを追加
  // 検索処理・ページネーション処理などはあとで追加する
  const [activeTab, setActiveTab] = useState<"results" | "recommends">(
    "results",
  );

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-green-500" />
            <span className="font-bold">Qiita Reader</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
              {TOP_PAGE_MOCK.userInitials}
            </span>
            <span className="text-zinc-600">
              こんにちは、{TOP_PAGE_MOCK.userName}さん
            </span>
            <Link
              href="/mypage"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
            >
              マイページ
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
            >
              ログイン
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="search-title"
                className="mb-1 block text-sm text-zinc-600"
              >
                タイトル
              </label>
              <input
                id="search-title"
                type="text"
                placeholder="入力してください"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="search-date-from"
                className="mb-1 block text-sm text-zinc-600"
              >
                投稿日(From)
              </label>
              <input
                id="search-date-from"
                type="date"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="search-date-to"
                className="mb-1 block text-sm text-zinc-600"
              >
                投稿日(To)
              </label>
              <input
                id="search-date-to"
                type="date"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="search-tag"
              className="mb-1 block text-sm text-zinc-600"
            >
              タグ
            </label>
            <input
              id="search-tag"
              type="text"
              placeholder="タグを入力してEnterで追加..."
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-6 py-2 font-medium hover:bg-zinc-50"
            >
              検索
            </button>
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-6 py-2 font-medium hover:bg-zinc-50"
            >
              リセット
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="border-b border-zinc-200">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("results")}
              className={
                activeTab === "results"
                  ? "border-b-2 border-green-500 px-2 py-3 text-sm font-medium text-green-600"
                  : "border-b-2 border-transparent px-2 py-3 text-sm text-zinc-600 hover:text-zinc-900"
              }
            >
              検索結果
              <span
                className={
                  activeTab === "results"
                    ? "ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                    : "ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                }
              >
                {TOP_PAGE_MOCK.totalResults}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recommends")}
              className={
                activeTab === "recommends"
                  ? "border-b-2 border-green-500 px-2 py-3 text-sm font-medium text-green-600"
                  : "border-b-2 border-transparent px-2 py-3 text-sm text-zinc-600 hover:text-zinc-900"
              }
            >
              みんなのおすすめ
              <span
                className={
                  activeTab === "recommends"
                    ? "ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                    : "ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                }
              >
                {TOP_PAGE_MOCK.recommendArticles.length}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "results" ? (
          <>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-sm text-zinc-500">
                {TOP_PAGE_MOCK.totalResults}件
              </p>
              <p className="text-sm text-zinc-400">新着順</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TOP_PAGE_MOCK.searchResults.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="font-bold leading-relaxed">{article.title}</h2>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-700">
                        {article.authorInitials}
                      </span>
                      <span className="text-zinc-700">{article.author}</span>
                    </div>
                    <span className="text-zinc-500">{article.date}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Qiita記事を開く"
                      className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-50"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </a>
                    {article.shared ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="currentColor"
                        >
                          <path d="M12 2l2.6 6.6L22 9.3l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-8L2 9.3l7.4-.7L12 2z" />
                        </svg>
                        済み
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2l2.6 6.6L22 9.3l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-8L2 9.3l7.4-.7L12 2z" />
                        </svg>
                        共有する
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <nav
              aria-label="ページネーション"
              className="mt-8 flex justify-center gap-2"
            >
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              >
                ‹ 前へ
              </button>
              <button
                type="button"
                className="rounded-lg border border-green-500 bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
              >
                1
              </button>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              >
                2
              </button>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              >
                3
              </button>
              <span className="px-2 py-2 text-sm text-zinc-400">…</span>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              >
                {TOP_PAGE_MOCK.totalPages}
              </button>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
              >
                次へ ›
              </button>
            </nav>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm text-zinc-500">
              {TOP_PAGE_MOCK.recommendArticles.length}件
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TOP_PAGE_MOCK.recommendArticles.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h2 className="font-bold leading-relaxed">{article.title}</h2>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-700">
                        {article.authorInitials}
                      </span>
                      <span className="text-zinc-700">{article.author}</span>
                    </div>
                    <span className="text-zinc-500">{article.date}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Qiita記事を開く"
                      className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-50"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </a>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-500">by</span>
                      <span className="flex size-6 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
                        {article.recommendedByInitials}
                      </span>
                      <span className="text-zinc-700">
                        {article.recommendedBy}
                      </span>
                      {article.isOwn && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          自分
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
