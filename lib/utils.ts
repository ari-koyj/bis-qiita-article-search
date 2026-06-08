// 名前からアバター表示用の2文字イニシャルを作る
export function toInitials(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";

  // スペース・アンダースコア・ハイフン区切りなら各語の先頭文字、
  // そうでなければ先頭2文字を使う
  const parts = trimmed.split(/[\s_-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
