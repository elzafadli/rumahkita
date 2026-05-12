import "server-only";

import { buildApiUrl } from "@/constants/api";
import type { HospitalsResponse } from "@/types/hospital";

export const HOSPITALS_REVALIDATE_SECONDS = 60 * 60;

export async function getHospitals(): Promise<HospitalsResponse> {
  const hospitalsUrl = buildApiUrl("/hospitals");

  if (!hospitalsUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(hospitalsUrl, {
    headers: { Accept: "application/json" },
    next: {
      revalidate: HOSPITALS_REVALIDATE_SECONDS,
      tags: ["hospitals"],
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Unexpected hospitals API response.");
  }

  if (!response.ok) {
    throw new Error("Data rumah sakit belum bisa dimuat.");
  }

  return response.json() as Promise<HospitalsResponse>;
}
