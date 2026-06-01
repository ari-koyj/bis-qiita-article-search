import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qiita Reader",
  description:
    "Qiita記事を検索し、ログインユーザー同士でおすすめ記事を共有できるアプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  const user = sessionUser
    ? {
        name:
          sessionUser.user_metadata?.name ??
          sessionUser.user_metadata?.user_name ??
          sessionUser.email?.split("@")[0] ??
          "user",
        initials: (
          sessionUser.user_metadata?.name ??
          sessionUser.user_metadata?.user_name ??
          sessionUser.email ??
          "U"
        )
          .slice(0, 2)
          .toUpperCase(),
      }
    : null;

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
