"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

/** Minutes east of UTC for an IANA time zone, e.g. "Asia/Kolkata" → 330. */
export function zoneOffset(timeZone: string, date: Date) {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

function formatOffset(minutes: number) {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `UTC${sign}${Math.floor(abs / 60)}${abs % 60 ? `:${String(abs % 60).padStart(2, "0")}` : ""}`;
}

export function formatGap(minutes: number) {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(" ");
}

/** Live clock in the owner's time zone, plus how far ahead/behind the visitor it is. */
export function useOwnerTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;

  const ownerOffset = zoneOffset(profile.timeZone, now);
  const visitorOffset = -now.getTimezoneOffset();
  const diff = ownerOffset - visitorOffset;

  return {
    iso: now.toISOString(),
    time: new Intl.DateTimeFormat("en-US", {
      timeZone: profile.timeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(now),
    offset: formatOffset(ownerOffset),
    relative: diff === 0 ? "Same time zone as you" : `${formatGap(diff)} ${diff > 0 ? "ahead of" : "behind"} you`,
  };
}

export function LocalTime({ compact = false }: { compact?: boolean }) {
  const t = useOwnerTime();

  // Server render / first paint: static label, no layout jump.
  if (!t) {
    return <span>{compact ? profile.timeZoneLabel : `${profile.timeZoneLabel} (local time)`}</span>;
  }

  if (compact) {
    return (
      <span>
        <time dateTime={t.iso}>{t.time}</time> {profile.timeZoneLabel}
      </span>
    );
  }

  return (
    <span className="flex flex-col">
      <span>
        <time dateTime={t.iso} className="font-semibold tabular-nums">
          {t.time}
        </time>{" "}
        {profile.timeZoneLabel} ({t.offset})
      </span>
      <span className="text-muted text-xs">{t.relative}</span>
    </span>
  );
}
