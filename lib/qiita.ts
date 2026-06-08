import { toInitials } from "@/lib/utils";
import type { QiitaArticle } from "@/types";

// Qiita API（GET /api/v2/items/:id）のレスポンスのうち利用する項目のみ
type QiitaApiItem = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  tags: { name: string }[];
  user: { id: string; name?: string | null };
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

// qiitaId をもとに Qiita API から記事情報を取得して正規化する。
// 取得失敗(記事削除・レート制限など)の場合は null を返す。
export async function fetchQiitaItem(
  qiitaId: string,
): Promise<QiitaArticle | null> {
  const token = process.env.QIITA_ACCESS_TOKEN;

  try {
    const res = await fetch(`https://qiita.com/api/v2/items/${qiitaId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 3600 }, // 1時間キャッシュ(レート制限対策)
    });
    if (!res.ok) return null;

    const item = (await res.json()) as QiitaApiItem;
    const author = item.user?.id ?? "unknown";

    return {
      id: item.id,
      title: item.title,
      url: item.url,
      tags: item.tags?.map((t) => t.name) ?? [],
      author,
      authorInitials: toInitials(author),
      date: formatDate(item.created_at),
    };
  } catch {
    return null;
  }
}
