import ArticleCard from "@/components/ArticleCard";
import Header from "@/components/Header";
import { MY_PAGE_MOCK } from "@/Mock";

export default function MyPage() {
  // ロジック(削除処理・データ取得など)はあとで追加する
  // いまは MY_PAGE_MOCK を直接埋め込む静的テンプレート

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
      <Header page="mypage" />

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
            <ArticleCard
              key={article.id}
              variant="mypage"
              title={article.title}
              tags={article.tags}
              author={article.author}
              authorInitials={article.authorInitials}
              date={article.date}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
