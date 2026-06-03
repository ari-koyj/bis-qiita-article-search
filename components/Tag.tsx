"use client";

type Props = {
  label: string;
  onRemove?: () => void;
};

export default function Tag({ label, onRemove }: Props) {
  // 削除可(検索フォーム用): × ボタン付き、サイズ大きめ
  if (onRemove) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
        {label}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} を削除`}
          className="text-green-700 hover:text-green-900"
        >
          ×
        </button>
      </span>
    );
  }

  // 表示のみ(記事カード用): サイズ小さめ
  return (
    <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-700">
      {label}
    </span>
  );
}
