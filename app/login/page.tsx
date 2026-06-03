import { EmailAuthForm } from "@/components/EmailAuthForm";
import { OAuthButtons } from "@/components/OAuthButtons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-zinc-900">
      <main className="flex flex-1 items-start justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold">ログイン / 新規登録</h1>
            <p className="mt-2 text-sm text-zinc-500">
              アカウントでログインして記事を共有しよう
            </p>
          </div>

          <div className="mt-8">
            <OAuthButtons />
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-400">またはメールで</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          <EmailAuthForm />
        </div>
      </main>
    </div>
  );
}
