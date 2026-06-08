"use client";

import Tag from "@/components/Tag";

type ArticleBase = {
  title: string;
  tags: string[];
  author: string;
  authorInitials: string;
  date: string;
  externalUrl?: string;
};

type ResultsVariant = {
  variant: "results";
  shared: boolean;
  onToggleShare?: () => void;
};

type RecommendsVariant = {
  variant: "recommends";
  recommendedBy: string;
  recommendedByInitials: string;
};

type MyPageVariant = {
  variant: "mypage";
  onDelete?: () => void;
};

type Props = ArticleBase & (ResultsVariant | RecommendsVariant | MyPageVariant);

export default function ArticleCard(props: Props) {
  const { title, tags, author, authorInitials, date, externalUrl } = props;

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h2 className="font-bold leading-relaxed">{title}</h2>

      <div className="mt-3 mb-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-700">
            {authorInitials}
          </span>
          <span className="text-zinc-700">{author}</span>
        </div>
        <span className="text-zinc-500">{date}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
        <a
          href={externalUrl ?? "#"}
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

        {props.variant === "results" &&
          (props.shared ? (
            <button
              type="button"
              onClick={props.onToggleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                <path d="M12 2l2.6 6.6L22 9.3l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-8L2 9.3l7.4-.7L12 2z" />
              </svg>
              済み
            </button>
          ) : (
            <button
              type="button"
              onClick={props.onToggleShare}
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
          ))}

        {props.variant === "recommends" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">by</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
              {props.recommendedByInitials}
            </span>
            <span className="text-zinc-700">{props.recommendedBy}</span>
          </div>
        )}

        {props.variant === "mypage" && (
          <button
            type="button"
            onClick={props.onDelete}
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
        )}
      </div>
    </article>
  );
}
