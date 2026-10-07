"use client";

import { LuArrowUpRight, LuBookOpen, LuDownload, LuQuote } from "react-icons/lu";
import { SiIeee } from "react-icons/si";
import { profile, publications, type Publication } from "@/lib/data";
import { useToast } from "./Toast";
import { Reveal, TiltCard } from "./ui";

/** "Publications" block inside the Research Journey section. */
export function Publications() {
  if (publications.length === 0) return null;

  return (
    <div className="mt-16 md:mt-20">
      <Reveal className="mb-8 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent-strong dark:text-accent-soft">
          <LuBookOpen aria-hidden className="size-5" />
        </span>
        <h3 id="publications" className="font-display text-2xl font-semibold tracking-tight">
          Publications
        </h3>
        <span className="badge font-mono">{publications.length}</span>
      </Reveal>

      <ol className="space-y-6">
        {publications.map((p) => (
          <PublicationCard key={p.url} pub={p} />
        ))}
      </ol>
    </div>
  );
}

function PublicationCard({ pub }: { pub: Publication }) {
  const toast = useToast();

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(bibtex(pub));
      toast({ kind: "success", title: "Citation copied", message: "BibTeX is on your clipboard." });
    } catch {
      toast({ kind: "error", title: "Couldn't copy", message: "Your browser blocked clipboard access." });
    }
  }

  return (
    <TiltCard
      as="li"
      max={2.5}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-brand-1/15 md:p-8 dark:hover:border-white/20 dark:hover:shadow-black/50"
    >
      {/* Accent bar */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-1 via-brand-2 to-brand-3" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Published
        </span>
        <span className="badge">{pub.kind}</span>
        <span className="badge font-mono">{pub.year}</span>
      </div>

      <h4 className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight text-balance md:text-2xl">
        {pub.title}
      </h4>

      <p className="mt-3 text-sm leading-relaxed">
        {pub.authors.map((a, i) => (
          <span key={a}>
            {a === profile.name ? <strong className="text-accent-adaptive font-semibold">{a}</strong> : a}
            {i < pub.authors.length - 1 && ", "}
          </span>
        ))}
      </p>
      <p className="text-muted mt-1 text-sm italic">
        {pub.venue}
        {pub.presentedAt && <span className="not-italic"> · {pub.presentedAt}</span>}
      </p>

      <p className="text-muted mt-4 leading-relaxed">{pub.summary}</p>

      {pub.results.length > 0 && (
        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2">
          {pub.results.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl border border-slate-200/70 bg-white/60 px-3.5 py-3 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <dt className="text-muted text-xs">{r.label}</dt>
              <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Topics">
        {pub.tags.map((t) => (
          <li key={t} className="badge">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5">
          <SiIeee aria-hidden className="size-6" />
          Read on IEEE Xplore
          <LuArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {pub.pdf && (
          <a href={pub.pdf} download className="btn-outline px-5 py-2.5">
            <LuDownload aria-hidden className="size-4" /> Download PDF
          </a>
        )}
        <button type="button" onClick={copyCitation} className="btn-outline px-5 py-2.5">
          <LuQuote aria-hidden className="size-4" /> Cite
        </button>
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted font-mono text-xs [overflow-wrap:anywhere] hover:underline"
          >
            DOI: {pub.doi}
          </a>
        )}
      </div>
    </TiltCard>
  );
}

/** BibTeX entry built from the publication data. */
function bibtex(p: Publication) {
  const surname = (n: string) => n.split(" ").slice(-1)[0];
  const key = `${surname(p.authors[0]).toLowerCase()}${p.year}${p.title.split(" ")[0].toLowerCase()}`;
  const authors = p.authors.map((a) => `${surname(a)}, ${a.split(" ").slice(0, -1).join(" ")}`).join(" and ");
  return [
    `@inproceedings{${key},`,
    `  title     = {${p.title}},`,
    `  author    = {${authors}},`,
    `  booktitle = {${p.venue}},`,
    `  year      = {${p.year}},`,
    p.doi ? `  doi       = {${p.doi}},` : null,
    `  url       = {${p.url}}`,
    `}`,
  ]
    .filter(Boolean)
    .join("\n");
}
