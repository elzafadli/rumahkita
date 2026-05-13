import DoctorPage from "@/components/DoctorPage";
import { getDoctorsByHospitalId } from "@/lib/doctors";
import { getHospitals } from "@/lib/hospitals";
import type { Doctor } from "@/types/doctor";
import type { Hospital } from "@/types/hospital";

export const revalidate = 3600;

const PRIMARY_HOSPITAL_NAMES = [
  "Mahkota Medical Centre",
  "Regency Specialist Hospital",
];

type DokterPageProps = {
  searchParams?: Promise<{
    hospitalId?: string;
  }>;
};

export default async function Dokter({ searchParams }: DokterPageProps) {
  let doctors: Doctor[] = [];
  let hospitals: Hospital[] = [];
  let errorMessage = "";
  const params = await searchParams;
  const selectedHospitalId = Number(params?.hospitalId);

  try {
    const hospitalsPayload = await getHospitals();
    hospitals = (hospitalsPayload.data ?? []).filter((hospital) =>
      PRIMARY_HOSPITAL_NAMES.includes(hospital.name),
    );

    const selectedHospital =
      hospitals.find((hospital) => hospital.id === selectedHospitalId) ??
      hospitals[0];

    if (selectedHospital) {
      const doctorsPayload = await getDoctorsByHospitalId(selectedHospital.id);
      doctors = doctorsPayload.data ?? [];
    }
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Data dokter belum bisa dimuat.";
  }

  return (
    <DoctorPage
      initialDoctors={doctors}
      initialError={errorMessage}
    />
  );
}
