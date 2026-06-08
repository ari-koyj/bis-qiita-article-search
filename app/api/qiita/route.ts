import type { NextRequest } from "next/server";
import { formatArticle, type QiitaItem } from "@/lib/qiita";
import type { SearchResponse } from "@/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const page = sp.get("page") ?? "1";
  const perPage = sp.get("per_page") ?? "21";
  const keyword = sp.get("keyword");
  const tagsParam = sp.get("tag");
  const dateFrom = sp.get("dateFrom");
  const dateTo = sp.get("dateTo");

  // Qiita 独自のクエリ構文を組み立てる
  // 複数条件は半角スペース区切り(URL 上では `+` または `%20` に変換される)
  // 例: title:React tag:Next.js created:>=2024-01-01
  const queryParts: string[] = [];
  if (keyword) queryParts.push(`title:${keyword}`);
  if (tagsParam) {
    tagsParam.split(",").forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) queryParts.push(`tag:${trimmed}`);
    });
  }
  if (dateFrom) queryParts.push(`created:>=${dateFrom}`);
  if (dateTo) queryParts.push(`created:<=${dateTo}`);
  const query = queryParts.join(" ");

  // URLSearchParams にすると " "(空白)を "+" に自動エンコード = Qiita に正しく届く
  const qiitaParams = new URLSearchParams({ page, per_page: perPage });
  if (query) qiitaParams.set("query", query);
  const url = `https://qiita.com/api/v2/items?${qiitaParams.toString()}`;

  try {
    const headers: HeadersInit = {};
    if (process.env.QIITA_TOKEN) {
      headers.Authorization = `Bearer ${process.env.QIITA_TOKEN}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 }, // 同じクエリは 60 秒キャッシュ
    });

    if (!res.ok) {
      return Response.json(
        { error: `Qiita API returned ${res.status}` },
        { status: 502 },
      );
    }

    // 総件数はレスポンスヘッダーに入っている
    const rawTotalCount = Number(res.headers.get("total-count") ?? 0);
    const items = (await res.json()) as QiitaItem[];
    const perPageNum = Number(perPage);

    // Qiita API は page × per_page <= 10000 という制約があるため
    // 上限を超えるページにアクセスできないように totalCount / totalPages をキャップする
    const QIITA_MAX_RESULTS = 10000;
    const maxPages = Math.floor(QIITA_MAX_RESULTS / perPageNum);
    const totalCount = Math.min(rawTotalCount, QIITA_MAX_RESULTS);
    const totalPages = Math.min(
      Math.ceil(rawTotalCount / perPageNum),
      maxPages,
    );

    const body: SearchResponse = {
      items: items.map(formatArticle),
      totalCount,
      totalPages,
    };

    return Response.json(body);
  } catch (err) {
    console.error("Qiita API error:", err);
    return Response.json(
      { error: "Failed to fetch Qiita API" },
      { status: 502 },
    );
  }
}
