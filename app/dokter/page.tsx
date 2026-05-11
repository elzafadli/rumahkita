import DoctorPage from "@/components/DoctorPage";
import { getDoctors } from "@/lib/doctors";
import type { Doctor } from "@/types/doctor";

export const revalidate = 3600;

export default async function Dokter() {
  let doctors: Doctor[] = [];
  let errorMessage = "";

  try {
    const payload = await getDoctors();
    doctors = payload.data ?? [];
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Data dokter belum bisa dimuat.";
  }

  return <DoctorPage initialDoctors={doctors} initialError={errorMessage} />;
}
