"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
    >
      Sign out
    </button>
  );
}
