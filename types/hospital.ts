export type Hospital = {
  id: number;
  name: string;
  source_reference: string | null;
  source_url: string | null;
  city_reference: string | null;
  city: {
    name: string;
    country: string;
  } | null;
  doctors_count: number;
  actions?: {
    select_token?: string;
    detail_url?: string;
    doctors_url?: string;
  };
};

export type HospitalsResponse = {
  data: Hospital[];
  meta?: {
    total?: number;
    cached?: boolean;
  };
};
