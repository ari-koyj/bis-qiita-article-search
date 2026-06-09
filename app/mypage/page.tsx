import Link from "next/link";
import { redirect } from "next/navigation";
import type { Recommend } from "@prisma/client";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { fetchQiitaItem } from "@/lib/qiita";
import { toInitials } from "@/lib/utils";
import { deleteRecommendAction } from "@/app/mypage/actions";
import ArticleCard from "@/components/ArticleCard";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン必須(未ログインはログイン画面へ)
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { recommends: true },
  });

  const userName = dbUser?.name ?? user.email?.split("@")[0] ?? "ユーザー";
  const userInitials = toInitials(userName);
  const recommends = dbUser?.recommends ?? [];

  // 各 qiitaId の記事情報を Qiita API から並列取得
  const items = await Promise.all(
    recommends.map(async (r: Recommend) => ({
      recommendId: r.id,
      qiitaId: r.qiitaId,
      article: await fetchQiitaItem(r.qiitaId),
    })),
  );

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
      <section className="border-b border-zinc-200 bg-orange-50">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-6 py-6">
          <span className="flex size-16 items-center justify-center rounded-full bg-sky-100 text-lg font-medium text-sky-700">
            {userInitials}
          </span>
          <div>
            <h1 className="text-xl font-bold">{userName}</h1>
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
                おすすめ済み {items.length}件
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
          <span className="text-sm text-zinc-500">{items.length}件</span>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
            まだおすすめした記事がありません。
            <br />
            <Link href="/" className="text-green-600 hover:underline">
              検索ページ
            </Link>
            から気になる記事を共有しましょう。
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map(({ recommendId, qiitaId, article }) =>
              article ? (
                <ArticleCard
                  key={recommendId}
                  variant="mypage"
                  title={article.title}
                  tags={article.tags}
                  author={article.author}
                  authorInitials={article.authorInitials}
                  date={article.date}
                  externalUrl={article.url}
                  onDelete={deleteRecommendAction.bind(null, recommendId)}
                />
              ) : (
                <article
                  key={recommendId}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <p className="font-bold text-zinc-500">
                    記事を取得できませんでした
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">ID: {qiitaId}</p>
                </article>
              ),
            )}
          </div>
        )}
      </main>
    </div>
  );
}
