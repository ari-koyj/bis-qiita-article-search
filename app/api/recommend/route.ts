import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { fetchQiitaItem } from "@/lib/qiita";
import { toInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { RecommendArticle, RecommendListResponse } from "@/types";

type RecommendWithUser = Prisma.RecommendGetPayload<{ include: { user: true } }>;

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
      recommends.map(async (r: RecommendWithUser) => {
        const article = await fetchQiitaItem(r.qiitaId);
        if (!article) return null;

        const displayName =
          r.user.name ?? r.user.email?.split("@")[0] ?? "user";

        const result: RecommendArticle = {
          ...article,
          recommendId: r.id,
          recommendedBy: displayName,
          recommendedByInitials: toInitials(r.user.name ?? r.user.email),
          isOwn: r.userId === currentUserId,
        };
        return result;
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
