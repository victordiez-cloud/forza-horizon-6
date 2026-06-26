"use client";

import { useEffect } from "react";
import type { CarRow } from "@/lib/types";

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

const STAT_COLOR = (v: number) => {
  if (v >= 9) return "bg-emerald-500";
  if (v >= 7) return "bg-yellow-500";
  if (v >= 5) return "bg-orange-500";
  return "bg-red-500";
};

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-400 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-zinc-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${STAT_COLOR(value)} transition-all duration-500`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-zinc-200 w-8 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

interface Props {
  car: CarRow | null;
  loading: boolean;
  onClose: () => void;
  onReroll: () => void;
}

export default function RandomCarModal({ car, loading, onClose, onReroll }: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎲</span>
            <span className="font-semibold text-zinc-100">Voiture aléatoire</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500 text-sm animate-pulse">
            Tirage en cours…
          </div>
        ) : car ? (
          <div className="p-5 space-y-5">
            {/* Car image */}
            <div className="flex items-center justify-center bg-zinc-800 rounded-lg overflow-hidden h-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.kudosprime.com/v2/images/car_media.php?g=fh6&id=${car.id}&t=side&v=1`}
                alt={car.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Name + badges */}
            <div>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight">{car.name}</h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`pi-badge ${PI_CLASS_COLORS[car.piClass] ?? "bg-zinc-700"} text-white`}>
                  {car.piClass} {car.piRating}
                </span>
                <span className="text-xs border border-zinc-600 text-zinc-300 rounded px-2 py-0.5">
                  {car.drivetrain}
                </span>
                {car.division && (
                  <span className="text-xs text-zinc-400">{car.division}</span>
                )}
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-zinc-800 rounded-lg py-2.5">
                <div className="text-lg font-bold text-zinc-100">
                  {car.topSpeedKph > 0 ? `${car.topSpeedKph.toFixed(0)}` : "—"}
                </div>
                <div className="text-xs text-zinc-500">km/h</div>
              </div>
              <div className="bg-zinc-800 rounded-lg py-2.5">
                <div className="text-lg font-bold text-zinc-100">
                  {car.powerKw > 0 ? car.powerKw : "—"}
                </div>
                <div className="text-xs text-zinc-500">kW</div>
              </div>
              <div className="bg-zinc-800 rounded-lg py-2.5">
                <div className="text-lg font-bold text-zinc-100">
                  {car.weightKg > 0 ? car.weightKg : "—"}
                </div>
                <div className="text-xs text-zinc-500">kg</div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <StatRow label="Vitesse" value={car.speed} />
              <StatRow label="Maniabilité" value={car.handling} />
              <StatRow label="Accélération" value={car.acceleration} />
              <StatRow label="Démarrage" value={car.launch} />
              <StatRow label="Freinage" value={car.braking} />
              <StatRow label="Off-road" value={car.offroad} />
            </div>

            {/* Price + source */}
            <div className="flex items-center justify-between text-sm text-zinc-400 border-t border-zinc-800 pt-3">
              <span>{car.price.toLocaleString("fr-FR")} Cr</span>
              <span>{car.source}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-zinc-500 text-sm">
            Aucune voiture ne correspond aux filtres.
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-zinc-800">
          <button
            onClick={onReroll}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-50 text-zinc-900 font-semibold text-sm rounded-lg py-2.5 transition-colors"
          >
            <span>🎲</span> Retirer
          </button>
          <button
            onClick={onClose}
            className="px-4 border border-zinc-600 hover:border-zinc-400 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
