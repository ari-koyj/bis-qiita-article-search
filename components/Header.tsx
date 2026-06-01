"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type User = {
  name: string;
  initials: string;
};

type Props = {
  user: User | null;
};

export default function Header({ user }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isMyPage = pathname === "/mypage";
  const isLoggedIn = user !== null;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green-500" />
          <span className="font-bold">Qiita Reader</span>
        </Link>

        {isMyPage && (
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="text-zinc-600 hover:text-zinc-900">
              検索ページに戻る
            </Link>
          </nav>
        )}

        {!isLoginPage && (
          <div className="ml-auto flex items-center gap-3 text-sm">
            {isLoggedIn ? (
              <>
                <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-xs font-medium text-sky-700">
                  {user.initials}
                </span>
                <span className="text-zinc-600">
                  こんにちは、{user.name}さん
                </span>
                {!isMyPage && (
                  <Link
                    href="/mypage"
                    className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
                  >
                    マイページ
                  </Link>
                )}
                <button
                  type="button"
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-1.5 font-medium hover:bg-zinc-50"
                >
                  ログアウト
                </button>
              </>
            ) : (
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
          </div>
        )}
      </div>
    </header>
  );
}
