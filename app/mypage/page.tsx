import Link from "next/link";
import { MY_PAGE_MOCK } from "@/Mock";

export default function MyPage() {
  // ロジック(削除処理・データ取得など)はあとで追加する
  // いまは MY_PAGE_MOCK を直接埋め込む静的テンプレート

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-green-500" />
            <span className="font-bold">Qiita Reader</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900">
              検索ページに戻る
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
              {MY_PAGE_MOCK.userInitials}
            </span>
            <span className="text-zinc-600">
              こんにちは、{MY_PAGE_MOCK.userName}さん
            </span>
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-200 bg-orange-50">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-6 py-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-sky-100 text-lg font-medium text-sky-700">
            {MY_PAGE_MOCK.userInitials}
          </span>
          <div>
            <h1 className="text-xl font-bold">{MY_PAGE_MOCK.userName}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-green-700">
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
                おすすめ済み {MY_PAGE_MOCK.recommendCount}件
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="flex items-baseline justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-green-500"
              fill="currentColor"
            >
              <path d="M12 2l2.6 6.6L22 9.3l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-8L2 9.3l7.4-.7L12 2z" />
            </svg>
            自分がおすすめした記事
          </h2>
          <span className="text-sm text-zinc-500">
            {MY_PAGE_MOCK.myRecommends.length}件
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MY_PAGE_MOCK.myRecommends.map((article) => (
            <article
              key={article.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold leading-relaxed">{article.title}</h3>

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
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
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
                    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6h14z" />
                  </svg>
                  削除
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
