"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { signUpWithEmail } from "@/app/login/actions";

type Mode = "signin" | "signup";

export function EmailAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<
    { type: "error" | "info"; text: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUpWithEmail(email, password);
      setLoading(false);
      if (error) {
        setMessage({ type: "error", text: error });
        return;
      }
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setMessage({ type: "error", text: signInError.message });
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    router.push("/");
    router.refresh();
  }

  function toggleMode() {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
    setMessage(null);
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="入力してください"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 placeholder:text-zinc-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {message && (
          <p
            className={
              message.type === "error"
                ? "text-sm text-red-600"
                : "text-sm text-green-700"
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-bold hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "処理中..." : mode === "signin" ? "ログイン" : "新規登録"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {mode === "signin" ? (
          <>
            アカウントをお持ちでない方は
            <button
              type="button"
              onClick={toggleMode}
              className="text-green-600 hover:underline"
            >
              新規登録へ
            </button>
          </>
        ) : (
          <>
            既にアカウントをお持ちの方は
            <button
              type="button"
              onClick={toggleMode}
              className="text-green-600 hover:underline"
            >
              ログインへ
            </button>
          </>
        )}
      </p>
    </>
  );
}
