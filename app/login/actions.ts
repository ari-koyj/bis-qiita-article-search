"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  if (!data.user) return { error: "ユーザーを作成できませんでした" };

  await prisma.user.upsert({
    where: { id: data.user.id },
    update: { email, provider: "email" },
    create: {
      id: data.user.id,
      email,
      provider: "email",
      name: email.split("@")[0] ?? null,
    },
  });

  return { error: null };
}
