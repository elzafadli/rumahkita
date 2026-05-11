import DoctorDetailPage from "@/components/DoctorDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DoctorDetailPage slug={slug} />;
}
