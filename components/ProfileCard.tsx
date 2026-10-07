import { LuSparkles } from "react-icons/lu";
import { profile } from "@/lib/data";
import { Avatar } from "./ui";

/** Glass profile card: avatar, role, "Currently" and "Focus". */
export function ProfileCard() {
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-2xl shadow-brand-1/10 dark:shadow-black/40">
      <div
        aria-hidden
        className="absolute -top-20 -right-20 size-56 rounded-full bg-gradient-to-br from-brand-1/40 to-brand-3/10 blur-2xl"
      />
      {/* pr-14 leaves room for the gallery button in the top-right corner */}
      <div className="relative flex items-center gap-4 pr-14">
        <Avatar size={72} className="shadow-lg shadow-sky-500/30" />
        <div>
          <p className="font-display text-lg font-semibold">{profile.name}</p>
          <p className="text-muted text-sm">{profile.role}</p>
        </div>
      </div>

      <dl className="relative mt-6 text-sm">
        <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
          <dt className="text-muted text-xs">Currently</dt>
          <dd className="mt-1 leading-snug font-semibold">{profile.current.title}</dd>
          <dd className="text-muted mt-0.5 text-xs">@ {profile.current.org}</dd>
        </div>
      </dl>

      <div className="relative mt-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3.5 text-sm dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-muted flex items-center gap-1.5 text-xs">
          <LuSparkles aria-hidden className="text-accent-adaptive size-3.5" /> Focus
        </p>
        <p className="mt-1 font-medium">{profile.currentFocus}</p>
      </div>
    </div>
  );
}
