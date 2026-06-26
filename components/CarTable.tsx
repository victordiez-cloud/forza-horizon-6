"use client";

import type { CarRow, SortField } from "@/lib/types";

const PI_CLASS_COLORS: Record<string, string> = {
  D: "bg-zinc-600 text-white",
  C: "bg-yellow-700 text-white",
  B: "bg-orange-600 text-white",
  A: "bg-red-600 text-white",
  S1: "bg-violet-600 text-white",
  S2: "bg-blue-600 text-white",
  X: "bg-emerald-600 text-white",
  R: "bg-pink-600 text-white",
};

interface Props {
  cars: CarRow[];
  sortBy: SortField;
  sortDir: "asc" | "desc";
  onSort: (field: SortField) => void;
}

const STAT_COLOR = (v: number) => {
  if (v >= 9) return "bg-emerald-500";
  if (v >= 7) return "bg-yellow-500";
  if (v >= 5) return "bg-orange-500";
  return "bg-red-500";
};

function StatBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5 min-w-[64px]">
      <div className="stat-bar flex-1">
        <div
          className={`stat-bar-fill ${STAT_COLOR(value)}`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs w-6 text-right text-zinc-300 tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function Th({
  field,
  label,
  sortBy,
  sortDir,
  onSort,
  className = "",
}: {
  field: SortField;
  label: string;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  onSort: (f: SortField) => void;
  className?: string;
}) {
  const active = sortBy === field;
  return (
    <th
      onClick={() => onSort(field)}
      className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors hover:text-zinc-100 ${
        active ? "text-brand" : "text-zinc-400"
      } ${className}`}
    >
      {label}
      {active && (
        <span className="ml-1 text-brand">{sortDir === "asc" ? "↑" : "↓"}</span>
      )}
    </th>
  );
}

export default function CarTable({ cars, sortBy, sortDir, onSort }: Props) {
  if (cars.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500 py-24 text-sm">
        Aucune voiture ne correspond aux filtres.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-zinc-900 sticky top-0 z-10">
          <tr>
            <Th field="name" label="Voiture" sortBy={sortBy} sortDir={sortDir} onSort={onSort} className="min-w-[220px]" />
            <Th field="piRating" label="PI" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 whitespace-nowrap">TR</th>
            <Th field="price" label="Prix" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="speed" label="Vitesse" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="handling" label="Maniabilité" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="acceleration" label="Accél." sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="launch" label="Démarr." sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="braking" label="Freinage" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="offroad" label="Off-road" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="topSpeedKph" label="Vmax" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="powerKw" label="kW" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
            <Th field="weightKg" label="Poids" sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {cars.map((car, i) => (
            <tr
              key={car.id}
              className={`border-t border-zinc-800 transition-colors hover:bg-zinc-800/50 ${
                i % 2 === 0 ? "bg-zinc-900/30" : ""
              }`}
            >
              <td className="px-3 py-2.5">
                <div className="font-medium text-zinc-100 leading-tight">{car.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{car.division || car.source}</div>
              </td>

              <td className="px-3 py-2.5">
                <span className={`pi-badge ${PI_CLASS_COLORS[car.piClass] ?? "bg-zinc-700 text-white"}`}>
                  {car.piRating}
                </span>
              </td>

              <td className="px-3 py-2.5">
                <span className="text-xs font-mono text-zinc-300">{car.drivetrain}</span>
              </td>

              <td className="px-3 py-2.5 whitespace-nowrap text-zinc-300 tabular-nums">
                {car.price.toLocaleString("fr-FR")} Cr
              </td>

              <td className="px-3 py-2.5"><StatBar value={car.speed} /></td>
              <td className="px-3 py-2.5"><StatBar value={car.handling} /></td>
              <td className="px-3 py-2.5"><StatBar value={car.acceleration} /></td>
              <td className="px-3 py-2.5"><StatBar value={car.launch} /></td>
              <td className="px-3 py-2.5"><StatBar value={car.braking} /></td>
              <td className="px-3 py-2.5"><StatBar value={car.offroad} /></td>

              <td className="px-3 py-2.5 tabular-nums text-zinc-300">
                {car.topSpeedKph > 0 ? `${car.topSpeedKph.toFixed(0)} km/h` : "—"}
              </td>
              <td className="px-3 py-2.5 tabular-nums text-zinc-300">
                {car.powerKw > 0 ? car.powerKw : "—"}
              </td>
              <td className="px-3 py-2.5 tabular-nums text-zinc-300">
                {car.weightKg > 0 ? `${car.weightKg} kg` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
