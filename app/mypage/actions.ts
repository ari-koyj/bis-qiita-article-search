"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// おすすめ削除(本人のみ)
export async function deleteRecommend(recommendId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  // id と userId を両方条件にすることで本人のレコードのみ削除する
  // (他人のおすすめは count 0 で何も起きない)
  const result = await prisma.recommend.deleteMany({
    where: { id: recommendId, userId: user.id },
  });

  if (result.count === 0) {
    return { error: "削除できませんでした" };
  }

  revalidatePath("/mypage");
  return { error: null };
}

// <form action={deleteRecommendAction.bind(null, recommendId)}> から呼ぶ。
// recommendId は bind 済みの引数として渡るため FormData に依存しない。
export async function deleteRecommendAction(
  recommendId: string,
): Promise<void> {
  await deleteRecommend(recommendId);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
