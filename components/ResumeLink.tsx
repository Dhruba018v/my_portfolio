"use client";

import { profile } from "@/lib/data";
import { useToast } from "./Toast";

/**
 * Resume / CV download. While `profile.resumeUrl` is empty (no CV yet), it's a button that
 * tells the visitor the CV hasn't been uploaded instead of downloading anything.
 */
export function ResumeLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const toast = useToast();

  if (profile.resumeUrl) {
    return (
      <a href={profile.resumeUrl} download className={className}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        toast({
          kind: "info",
          title: "CV not uploaded yet",
          message: `It's coming soon. Meanwhile, feel free to email me at ${profile.email}.`,
        })
      }
    >
      {children}
    </button>
  );
}
