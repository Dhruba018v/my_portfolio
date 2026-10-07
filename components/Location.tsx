"use client";

import { useEffect, useState } from "react";
import { LuArrowUpRight, LuClock, LuLocateFixed, LuLoaderCircle, LuMapPin, LuNavigation, LuRoute } from "react-icons/lu";
import { profile } from "@/lib/data";
import { formatGap, LocalTime, zoneOffset } from "./LocalTime";
import { Reveal } from "./ui";

const { place } = profile;
export const placeMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`;

/** Keyless Google Maps embed centred on a coordinate. */
function MapEmbed({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  return (
    <iframe
      title={title}
      src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full w-full border-0 dark:[filter:invert(0.9)_hue-rotate(180deg)_saturate(0.8)]"
    />
  );
}

/** Great-circle distance in km. */
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(r(bLat - aLat) / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(r(bLng - aLng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function Location() {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <Reveal className="h-full">
        <MyLocationCard />
      </Reveal>
      <Reveal delay={0.1} className="h-full">
        <VisitorLocationCard />
      </Reveal>
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-accent-adaptive mb-4 font-mono text-xs font-semibold tracking-[0.2em] uppercase">{children}</p>
  );
}

function MyLocationCard() {
  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="relative h-52 overflow-hidden border-b border-slate-200 dark:border-white/10">
        <MapEmbed lat={place.lat} lng={place.lng} title={`Map showing ${place.name}`} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <CardLabel>Developer&apos;s location</CardLabel>
        <a
          href={placeMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-start gap-2 font-display text-xl font-semibold tracking-tight hover:underline"
        >
          <LuMapPin aria-hidden className="text-accent-adaptive mt-1 size-5 shrink-0" />
          <span>
            {place.name}
            <LuArrowUpRight
              aria-hidden
              className="ml-1 inline size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </span>
        </a>
        <p className="text-muted mt-1 pl-7 text-sm">{place.address}</p>

        <div className="mt-4 flex items-start gap-2 pl-0.5 text-sm">
          <LuClock aria-hidden className="text-accent-adaptive mt-0.5 size-4 shrink-0" />
          <LocalTime />
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <a href={placeMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary py-2">
            <LuMapPin aria-hidden className="size-4" /> Open in Google Maps
          </a>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline py-2">
            <LuRoute aria-hidden className="size-4" /> Get directions
          </a>
        </div>
      </div>
    </div>
  );
}

// Some browsers still report outdated zone names.
const legacyZones: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Asia/Katmandu": "Asia/Kathmandu",
  "Asia/Rangoon": "Asia/Yangon",
  "Europe/Kiev": "Europe/Kyiv",
};

type Precise = { lat: number; lng: number; label: string | null };
type Status = "idle" | "locating" | "done" | "denied" | "error" | "unsupported";

function VisitorLocationCard() {
  const [zone, setZone] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [precise, setPrecise] = useState<Precise | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setNow(new Date());
    if (!window.isSecureContext || !("geolocation" in navigator)) setStatus("unsupported");
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  function locate() {
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        let label: string | null = null;
        try {
          // Free, keyless reverse geocoding intended for client-side use.
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
          );
          const d = await res.json();
          // Prefer the short country name ("United Kingdom" over the official long form).
          const country = d.countryCode
            ? new Intl.DisplayNames(["en"], { type: "region" }).of(d.countryCode)
            : d.countryName;
          label = [d.city || d.locality, d.principalSubdivision, country].filter(Boolean).join(", ") || null;
        } catch {
          // Fall back to coordinates below.
        }
        setPrecise({ lat, lng, label });
        setStatus("done");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  }

  // Approximate place from the time zone name, e.g. "Europe/London" → "London, Europe".
  const zoneParts = (zone ? (legacyZones[zone] ?? zone) : "").split("/").filter(Boolean);
  const approx = zoneParts.length
    ? [zoneParts[zoneParts.length - 1], zoneParts[0]].map((s) => s.replace(/_/g, " ")).join(", ")
    : null;

  const visitorTime = now
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(now)
    : null;
  const visitorZoneName = now
    ? new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
        .formatToParts(now)
        .find((p) => p.type === "timeZoneName")?.value
    : null;
  const diff = now ? zoneOffset(profile.timeZone, now) + now.getTimezoneOffset() : 0;
  const firstName = profile.name.split(" ")[0];

  const km = precise ? distanceKm(precise.lat, precise.lng, place.lat, place.lng) : null;

  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="relative h-52 overflow-hidden border-b border-slate-200 dark:border-white/10">
        {precise ? (
          <MapEmbed lat={precise.lat} lng={precise.lng} title="Map showing your location" />
        ) : (
          <div className="relative grid h-full place-items-center bg-gradient-to-br from-brand-1/15 via-brand-2/10 to-brand-3/15 p-6 text-center">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
            <div className="relative">
              <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-accent/15 text-accent-strong dark:text-accent-soft">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                <LuNavigation aria-hidden className="relative size-6" />
              </span>
              <p className="text-muted mt-3 max-w-xs text-sm">
                Share your location to see it on the map and how far you are from me.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6" aria-live="polite">
        <CardLabel>Your location</CardLabel>
        <p className="inline-flex items-start gap-2 font-display text-xl font-semibold tracking-tight">
          <LuMapPin aria-hidden className="text-accent-adaptive mt-1 size-5 shrink-0" />
          <span>{precise ? (precise.label ?? `${precise.lat.toFixed(3)}, ${precise.lng.toFixed(3)}`) : (approx ?? "Detecting…")}</span>
        </p>
        <p className="text-muted mt-1 pl-7 text-sm">
          {precise
            ? km !== null && km < 1
              ? "You're right here — come say hi!"
              : `About ${Math.round(km ?? 0).toLocaleString("en-US")} km from me`
            : "Approximate, based on your time zone"}
        </p>

        {visitorTime && (
          <div className="mt-4 flex items-start gap-2 pl-0.5 text-sm">
            <LuClock aria-hidden className="text-accent-adaptive mt-0.5 size-4 shrink-0" />
            <span className="flex flex-col">
              <span>
                <span className="font-semibold tabular-nums">{visitorTime}</span> {visitorZoneName} (your time)
              </span>
              <span className="text-muted text-xs">
                {diff === 0
                  ? `Same time zone as ${firstName}`
                  : `${firstName} is ${formatGap(Math.abs(diff))} ${diff > 0 ? "ahead of" : "behind"} you`}
              </span>
            </span>
          </div>
        )}

        <div className="mt-auto pt-6">
          {status === "unsupported" ? (
            <p className="text-muted text-xs">
              Precise location isn&apos;t available in this browser or on an insecure (http) connection.
            </p>
          ) : status === "done" ? (
            <p className="text-muted text-xs">
              Used only to show this card (looked up via BigDataCloud &amp; Google Maps). It isn&apos;t sent to me or
              stored.
            </p>
          ) : (
            <>
              <button type="button" onClick={locate} disabled={status === "locating"} className="btn-outline py-2">
                {status === "locating" ? (
                  <LuLoaderCircle aria-hidden className="size-4 animate-spin" />
                ) : (
                  <LuLocateFixed aria-hidden className="size-4" />
                )}
                {status === "locating" ? "Locating…" : "Use my precise location"}
              </button>
              {status === "denied" && (
                <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                  Location permission was blocked. Showing an approximate location instead.
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                  Couldn&apos;t get your location. Please try again.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
