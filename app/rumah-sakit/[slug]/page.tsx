import { notFound } from "next/navigation";
import HospitalDetailPage from "@/components/HospitalDetailPage";
import { getHospitals } from "@/lib/hospitals";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getHospitals();
  const hospital = payload.data.find(
    (item) => item.source_reference === slug || String(item.id) === slug,
  );

  if (!hospital) {
    notFound();
  }

  return <HospitalDetailPage hospital={hospital} />;
}
