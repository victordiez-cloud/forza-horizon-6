"use client";

import { useEffect, useState, useCallback } from "react";
import FilterPanel from "@/components/FilterPanel";
import CarTable from "@/components/CarTable";
import Pagination from "@/components/Pagination";
import RandomCarModal from "@/components/RandomCarModal";
import type { CarFilters, CarRow, CarsResponse, SortField } from "@/lib/types";

interface FilterOptions {
  makes: string[];
  divisions: string[];
  drivetrains: string[];
  sources: string[];
  piClasses: string[];
  decades: number[];
}

const DEFAULT_FILTERS: CarFilters = {
  sortBy: "piRating",
  sortDir: "desc",
  page: 1,
  perPage: 20,
};

function buildFilterParams(filters: CarFilters, search: string): URLSearchParams {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (filters.piClass) params.set("piClass", filters.piClass);
  if (filters.division) params.set("division", filters.division);
  if (filters.make) params.set("make", filters.make);
  if (filters.drivetrain) params.set("drivetrain", filters.drivetrain);
  if (filters.source) params.set("source", filters.source);
  if (filters.decade) params.set("decade", filters.decade);
  if (filters.isDlc !== undefined) params.set("isDlc", filters.isDlc as string);
  return params;
}

export default function Home() {
  const [filters, setFilters] = useState<CarFilters>(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<CarsResponse | null>(null);
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  // Random car state
  const [randomOpen, setRandomOpen] = useState(false);
  const [randomCar, setRandomCar] = useState<CarRow | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Load filter options once
  useEffect(() => {
    fetch("/api/cars/filters")
      .then((r) => r.json())
      .then(setOptions);
  }, []);

  // Fetch cars on filter or search change
  useEffect(() => {
    setLoading(true);
    const params = buildFilterParams(filters, debouncedSearch);
    params.set("sortBy", filters.sortBy ?? "piRating");
    params.set("sortDir", filters.sortDir ?? "desc");
    params.set("page", String(filters.page ?? 1));
    params.set("perPage", String(filters.perPage ?? 20));

    fetch(`/api/cars?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, [filters, debouncedSearch]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const handleSort = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const handleRandom = useCallback(() => {
    setRandomOpen(true);
    setRandomLoading(true);
    const params = buildFilterParams(filters, debouncedSearch);
    fetch(`/api/cars/random?${params}`)
      .then((r) => r.json())
      .then((car) => {
        setRandomCar(car);
        setRandomLoading(false);
      });
  }, [filters, debouncedSearch]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Random car modal */}
      {randomOpen && (
        <RandomCarModal
          car={randomCar}
          loading={randomLoading}
          onClose={() => setRandomOpen(false)}
          onReroll={handleRandom}
        />
      )}

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 leading-tight">
              Forza Horizon 6{" "}
              <span className="text-brand">— Liste des voitures</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {data ? `${data.total} voitures trouvées` : "Chargement…"}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Random button */}
            <button
              onClick={handleRandom}
              title="Tirer une voiture aléatoire parmi les filtres actifs"
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 hover:border-brand text-zinc-200 text-sm font-medium rounded-lg px-3.5 py-2 transition-colors"
            >
              <span className="text-base leading-none">🎲</span>
              <span>Aléatoire</span>
              {data && data.total > 0 && (
                <span className="text-xs text-zinc-500">({data.total})</span>
              )}
            </button>

            {/* Search */}
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Rechercher une voiture…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 text-zinc-100 text-sm rounded-lg pl-9 pr-3 py-2 placeholder-zinc-500 focus:outline-none focus:border-brand transition-colors"
              />
              <svg
                className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        {options && (
          <FilterPanel
            filters={filters}
            options={options}
            onChange={setFilters}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {loading && (
            <div className="text-center text-zinc-500 text-sm py-2 animate-pulse">
              Chargement…
            </div>
          )}

          {data && (
            <>
              <CarTable
                cars={data.cars}
                sortBy={filters.sortBy ?? "piRating"}
                sortDir={filters.sortDir ?? "desc"}
                onSort={handleSort}
              />
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                perPage={data.perPage}
                onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                onPerPageChange={(n) =>
                  setFilters((f) => ({ ...f, perPage: n, page: 1 }))
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
