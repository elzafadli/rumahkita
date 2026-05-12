import HospitalPage from "@/components/HospitalPage";

export const revalidate = 3600;

export default async function RumahSakit() {
  return <HospitalPage />;
}
