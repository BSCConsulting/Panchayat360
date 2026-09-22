export type Lang = "te" | "en";

export type GramPanchayat = {
  district: "NTR" | "Krishna" | "West Godavari" | string;
  mandal: string;
  mandal_population: number | null;
  gp_name: string;
  gp_population: number;
  statutory_wards: number;
  statutory_tier: string;
};

export type WardStatus = "green" | "yellow" | "red";

export type WardCard = {
  id: number;
  status: WardStatus;
  label: string;
  delta: string;
  note: string;
};
