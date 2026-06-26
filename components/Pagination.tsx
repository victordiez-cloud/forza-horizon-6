"use client";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
}: Props) {
  const from = Math.min((page - 1) * perPage + 1, total);
  const to = Math.min(page * perPage, total);

  const pages = buildPages(page, totalPages);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-3">
      <div className="text-sm text-zinc-400">
        {from}–{to} sur {total} voitures
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-2 py-1 rounded border border-zinc-700 text-zinc-300 text-sm disabled:opacity-30 hover:border-zinc-500 transition-colors"
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1 text-zinc-500 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1 rounded border text-sm transition-colors ${
                p === page
                  ? "bg-brand border-brand text-zinc-900 font-semibold"
                  : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2 py-1 rounded border border-zinc-700 text-zinc-300 text-sm disabled:opacity-30 hover:border-zinc-500 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span>Par page :</span>
        {[20, 50, 100].map((n) => (
          <button
            key={n}
            onClick={() => onPerPageChange(n)}
            className={`px-2.5 py-0.5 rounded border text-xs transition-colors ${
              perPage === n
                ? "bg-zinc-700 border-zinc-500 text-zinc-100"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
