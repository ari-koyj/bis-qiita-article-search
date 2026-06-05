import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Article, RecommendArticle, RecommendListResponse } from "@/types";

// Qiita API の単一記事取得時のレスポンス型(必要なフィールドだけ抜粋)
type QiitaItem = {
  id: string;
  title: string;
  url: string;
  tags: { name: string }[];
  user: {
    id: string;
    profile_image_url: string;
  };
  created_at: string;
};

// Qiita API から記事 1 件取得。失敗(404 等)時は null
async function fetchQiitaArticle(qiitaId: string): Promise<QiitaItem | null> {
  const headers: HeadersInit = {};
  if (process.env.QIITA_TOKEN) {
    headers.Authorization = `Bearer ${process.env.QIITA_TOKEN}`;
  }
  try {
    const res = await fetch(`https://qiita.com/api/v2/items/${qiitaId}`, {
      headers,
      next: { revalidate: 300 }, // 5 分キャッシュ
    });
    if (!res.ok) return null;
    return (await res.json()) as QiitaItem;
  } catch {
    return null;
  }
}

// Qiita の生レスポンスを画面で扱う Article 型に整形
function formatArticle(item: QiitaItem): Article {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    tags: item.tags.map((t) => t.name),
    author: item.user.id,
    authorInitials: item.user.id.slice(0, 2).toUpperCase(),
    date: item.created_at.split("T")[0].replace(/-/g, "/"),
  };
}

// POST /api/recommend - おすすめ登録(ログイン必須)
export async function POST(req: NextRequest) {
  // 1. 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. リクエスト body から qiitaId を取り出してバリデーション
  const body = (await req.json().catch(() => null)) as {
    qiitaId?: unknown;
  } | null;
  const qiitaId =
    body && typeof body.qiitaId === "string" ? body.qiitaId.trim() : "";
  if (!qiitaId) {
    return Response.json({ error: "qiitaId is required" }, { status: 400 });
  }

  // 3. Prisma で Recommend を作成
  try {
    const created = await prisma.recommend.create({
      data: { qiitaId, userId: user.id },
    });
    return Response.json({ id: created.id }, { status: 201 });
  } catch (err) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? (err as { code?: string }).code
        : undefined;

    // P2002: ユニーク制約違反(既に共有済み)
    if (code === "P2002") {
      return Response.json({ error: "Already shared" }, { status: 409 });
    }
    // P2003: 外部キー制約違反(User レコードが DB にない)
    if (code === "P2003") {
      console.error("User record missing in Prisma DB:", user.id);
      return Response.json(
        { error: "User record not found. Please sign up again." },
        { status: 500 },
      );
    }

    console.error("Failed to create recommend:", err);
    return Response.json(
      { error: "Failed to create recommend" },
      { status: 500 },
    );
  }
}

// GET /api/recommend - 全ユーザーのおすすめ一覧
export async function GET() {
  try {
    // 0. 現在のログインユーザーを取得(未ログインなら null)
    //    isOwn 判定のためだけに使うので、未ログインでもエラーにしない
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    const currentUserId = currentUser?.id ?? null;

    // 1. DB から Recommend を全件取得(User 情報も同時に取り出す)
    const recommends = await prisma.recommend.findMany({
      include: { user: true },
    });

    // 2. 各 qiitaId について Qiita API を並列に叩いて記事情報を補完
    const enriched = await Promise.all(
      recommends.map(async (r) => {
        const item = await fetchQiitaArticle(r.qiitaId);
        if (!item) return null;

        const displayName =
          r.user.name ?? r.user.email?.split("@")[0] ?? "user";
        const initials = (r.user.name ?? r.user.email ?? "U")
          .slice(0, 2)
          .toUpperCase();

        const article: RecommendArticle = {
          ...formatArticle(item),
          recommendId: r.id,
          recommendedBy: displayName,
          recommendedByInitials: initials,
          isOwn: r.userId === currentUserId,
        };
        return article;
      }),
    );

    // 3. Qiita から取れなかった(削除済記事等)を除外し、投稿日の新しい順に並べる
    const items = enriched
      .filter((x): x is RecommendArticle => x !== null)
      .sort((a, b) => b.date.localeCompare(a.date));

    const body: RecommendListResponse = { items };
    return Response.json(body);
  } catch (err) {
    console.error("Failed to fetch recommends:", err);
    return Response.json(
      { error: "Failed to fetch recommends" },
      { status: 500 },
    );
  }
}
