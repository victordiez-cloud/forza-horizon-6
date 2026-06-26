"use client";

import type { CarFilters } from "@/lib/types";

interface FilterOptions {
  makes: string[];
  divisions: string[];
  drivetrains: string[];
  sources: string[];
  piClasses: string[];
  decades: number[];
}

interface Props {
  filters: CarFilters;
  options: FilterOptions;
  onChange: (filters: CarFilters) => void;
}

const PI_CLASS_COLORS: Record<string, string> = {
  D: "bg-zinc-600",
  C: "bg-yellow-700",
  B: "bg-orange-600",
  A: "bg-red-600",
  S1: "bg-violet-600",
  S2: "bg-blue-600",
  X: "bg-emerald-600",
  R: "bg-pink-600",
};

export default function FilterPanel({ filters, options, onChange }: Props) {
  const set = (key: keyof CarFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 });

  return (
    <aside className="w-64 shrink-0 space-y-5">
      {/* PI Class */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Classe PI
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["", ...options.piClasses].map((cls) => (
            <button
              key={cls || "all"}
              onClick={() => set("piClass", cls)}
              className={`pi-badge border transition-colors ${
                (filters.piClass ?? "") === cls
                  ? cls
                    ? `${PI_CLASS_COLORS[cls]} text-white border-transparent`
                    : "bg-zinc-100 text-zinc-900 border-transparent"
                  : "bg-transparent text-zinc-300 border-zinc-600 hover:border-zinc-400"
              }`}
            >
              {cls || "Tout"}
            </button>
          ))}
        </div>
      </div>

      {/* Drivetrain */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Transmission
        </p>
        <div className="flex gap-2">
          {["", ...options.drivetrains].map((dt) => (
            <button
              key={dt || "all"}
              onClick={() => set("drivetrain", dt)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                (filters.drivetrain ?? "") === dt
                  ? "bg-brand text-zinc-900 border-brand font-semibold"
                  : "bg-transparent text-zinc-300 border-zinc-600 hover:border-zinc-400"
              }`}
            >
              {dt || "Tout"}
            </button>
          ))}
        </div>
      </div>

      {/* Decade */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Décennie
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[{ label: "Tout", value: "" }, ...options.decades.map((d) => ({ label: `${d}s`, value: String(d) }))].map(
            ({ label, value }) => (
              <button
                key={value || "all"}
                onClick={() => set("decade", value)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  (filters.decade ?? "") === value
                    ? "bg-brand text-zinc-900 border-brand font-semibold"
                    : "bg-transparent text-zinc-300 border-zinc-600 hover:border-zinc-400"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Division */}
      <SelectFilter
        label="Division"
        value={filters.division ?? ""}
        options={options.divisions}
        onChange={(v) => set("division", v)}
      />

      {/* Make */}
      <SelectFilter
        label="Marque"
        value={filters.make ?? ""}
        options={options.makes}
        onChange={(v) => set("make", v)}
      />

      {/* Source */}
      <SelectFilter
        label="Source"
        value={filters.source ?? ""}
        options={options.sources}
        onChange={(v) => set("source", v)}
      />

      {/* DLC */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Contenu
        </p>
        <div className="flex gap-2">
          {[
            { label: "Tout", value: "" },
            { label: "Base", value: "false" },
            { label: "DLC", value: "true" },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => set("isDlc", value)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                (filters.isDlc ?? "") === value
                  ? "bg-brand text-zinc-900 border-brand font-semibold"
                  : "bg-transparent text-zinc-300 border-zinc-600 hover:border-zinc-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ page: 1 })}
        className="w-full text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 rounded py-1.5 transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </aside>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-brand"
      >
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
