export type Doctor = {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  specialization: string | null;
  photo_url: string | null;
  profile_url: string | null;
  hospital: {
    name: string;
    city: string;
    country: string;
  } | null;
  clinic_location: string | null;
  languages: string[];
  specialties: {
    slug: string;
    name: string;
  }[];
  consultation_hours_raw: string | null;
};

export type DoctorsResponse = {
  data: Doctor[];
  meta?: {
    total?: number;
  };
};
