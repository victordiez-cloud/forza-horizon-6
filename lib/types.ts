export type SortField =
  | "name"
  | "make"
  | "year"
  | "piRating"
  | "price"
  | "speed"
  | "handling"
  | "acceleration"
  | "launch"
  | "braking"
  | "offroad"
  | "topSpeedKph"
  | "powerKw"
  | "weightKg";

export interface CarFilters {
  search?: string;
  piClass?: string;
  division?: string;
  make?: string;
  drivetrain?: string;
  source?: string;
  decade?: string;
  isDlc?: string;
  sortBy?: SortField;
  sortDir?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface CarsResponse {
  cars: CarRow[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export type CarRow = {
  id: number;
  slug: string;
  name: string;
  make: string;
  model: string;
  year: number;
  division: string;
  piRating: number;
  piClass: string;
  drivetrain: string;
  price: number;
  source: string;
  isDlc: boolean;
  speed: number;
  handling: number;
  acceleration: number;
  launch: number;
  braking: number;
  offroad: number;
  powerKw: number;
  weightKg: number;
  topSpeedKph: number;
};
