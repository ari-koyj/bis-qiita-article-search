import Link from "next/link";

type Props =
  | { page: "top"; isLoggedIn: false }
  | {
      page: "top";
      isLoggedIn: true;
      userName: string;
      userInitials: string;
    }
  | { page: "mypage" }
  | { page: "login" };

export default function Header(props: Props) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green-500" />
          <span className="font-bold">Qiita Reader</span>
        </Link>

        {props.page === "mypage" && (
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900">
              検索ページに戻る
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3 text-sm">
          {props.page === "top" && !props.isLoggedIn && (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
              >
                マイページ
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
              >
                ログイン
              </Link>
            </>
          )}

          {props.page === "top" && props.isLoggedIn && (
            <>
              <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
                {props.userInitials}
              </span>
              <span className="text-zinc-600">
                こんにちは、{props.userName}さん
              </span>
              <Link
                href="/mypage"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
              >
                マイページ
              </Link>
              <button
                type="button"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
              >
                ログアウト
              </button>
            </>
          )}

          {props.page === "mypage" && (
            <button
              type="button"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
            >
              ログアウト
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
