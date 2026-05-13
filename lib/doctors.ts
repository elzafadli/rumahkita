import "server-only";

import { buildApiUrl } from "@/constants/api";
import type { DoctorsResponse } from "@/types/doctor";

export const DOCTORS_REVALIDATE_SECONDS = 60 * 60;

function getDoctorsCacheTags(hospitalId: number) {
  return ["doctors", `hospital-${hospitalId}-doctors`];
}

function withDoctorsCacheScope(url: string, hospitalId: number) {
  const scopedUrl = new URL(url);
  scopedUrl.searchParams.set("hospitalId", String(hospitalId));

  return scopedUrl.toString();
}

export async function getDoctors(): Promise<DoctorsResponse> {
  const hospitalId = 2;
  const doctorsUrl = buildApiUrl(`/${hospitalId}/doctors`);

  if (!doctorsUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(withDoctorsCacheScope(doctorsUrl, hospitalId), {
    headers: { Accept: "application/json" },
    next: {
      revalidate: DOCTORS_REVALIDATE_SECONDS,
      tags: getDoctorsCacheTags(hospitalId),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected doctors API response.");
  }

  if (!response.ok) {
    throw new Error("Data dokter belum bisa dimuat.");
  }

  return response.json() as Promise<DoctorsResponse>;
}

export async function getDoctorsByHospitalId(
  hospitalId: number,
): Promise<DoctorsResponse> {
  const doctorsUrl = buildApiUrl(`/${hospitalId}/doctors`);

  if (!doctorsUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(withDoctorsCacheScope(doctorsUrl, hospitalId), {
    headers: { Accept: "application/json" },
    next: {
      revalidate: DOCTORS_REVALIDATE_SECONDS,
      tags: getDoctorsCacheTags(hospitalId),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected doctors API response.");
  }

  if (!response.ok) {
    throw new Error("Data dokter belum bisa dimuat.");
  }

  return response.json() as Promise<DoctorsResponse>;
}
