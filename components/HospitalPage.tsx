import Image from "next/image";
import Link from "next/link";
import { getHospitals } from "@/lib/hospitals";
import SiteFooter from "@/components/shared/SiteFooter";
import SiteHeader from "@/components/shared/SiteHeader";
import type { Hospital } from "@/types/hospital";

type IconName = "arrow_forward" | "public" | "search" | "verified";

type FeaturedHospitalPresentation = {
  badge: string;
  icon: "public" | "verified";
  description: string;
  tags: string[];
  image: string;
};

const featuredHospitalPresentation: Record<string, FeaturedHospitalPresentation> = {
  regency_specialist: {
    badge: "Premium Partner",
    icon: "verified" as const,
    description:
      "Pusat medis terkemuka dengan fasilitas lengkap yang melayani pasien internasional dengan standar kualitas tinggi.",
    tags: ["Jantung", "Bedah Saraf", "Kanker"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCSZczypQMo-X0NvL3Ss4l1s3CkRwnZhCIA_vIocQgyosWwLP1KGV4JjgmLf93Oe5micY-EZOR4T2-6DwezyE1YJGrByXByt-gV5Lon5W76YGnpjnw7QWgjYn25DMaEMv4l1e7lHmP5g_LGcv-oDiz_E9oj_67eYvPAJ0_mRnpU8gnwX_k-b7wx4RBUmW66Sy5iFbbBQTqcP4NcPJYswywZw-gVTF93Gpx2SPdLVG-XbDflMPI40m85lMfhpAJ-9Xm-agdSipWzmEq",
  },
  mahkota_medical: {
    badge: "International Standard",
    icon: "public" as const,
    description:
      "Fasilitas medis tercanggih di Iskandar Puteri yang menawarkan perawatan tersier berkualitas premium bagi pasien global.",
    tags: ["Ortopedi", "Kesehatan Wanita", "Pemeriksaan Kesehatan"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIMQTDqDt2IPAlR8Bgphs93y6VeDGXR-0HrGtnG_YcNCQHthVDCeTqvozFRZ6dFw9n0n_MqWhLAfNnd_zWCZAlFV1zpuNkmcM7G4Kp8rt2F-rYZYU5a66mEMbwt7-BCHpg_5-ZnYavE7LpPDiRiSw4aawOA7jTDVu7-UeE2RFQFmnLAA8IhVvi5rrdwcGyecPyFbvqQyKE-kf6jalqKV7WbXaTKb5z9_kiWYGM892fTEYuoFPk8ahxUYbPqxejfFw33QCFbXUvSKNK",
  },
};

const secondaryHospitals = [
  {
    name: "KPJ Johor Specialist Hospital",
    description:
      "Dikenal luas dengan reputasi layanan berkualitas dan fasilitas medis yang lengkap di pusat kota Johor Bahru.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNQ7shoMVDut8UlLOEr5Dq_fUy_3LmRT-a5ivfygXrQ5KdF3NP12FBO2n91iHJxdkdlc8zEBt_SCBf_DFwtv57GjqbzWoLAceDbxe6F1JRI29by9n8_IxLUOXmOAhKqhYoOTGTnaaRJQVx9Yt0MxDZtw3qO9-ZMsIcbckr2BGgXUhk5gL3A3OuTX7RSyAyccfSHgcNBb96i8qpghaR8jwREG3O3dTDInY8lFA0H6p6oa1_qXrw6LOKqceDG7jEDRTnNVZzfakBwEh2",
  },
  {
    name: "Columbia Asia Hospital - Tebrau",
    description:
      "Rumah sakit komunitas dengan fokus pada kemudahan akses dan perawatan personal yang efisien untuk keluarga.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0AXTHmnKIc-XhPeEVYxcI-4kI96xUviAl9pEDoakqENIyJbyc9-aIsOE3Gfluzks8gchXMOz18p4szhvQKScTdq8JmSo8diFXXUjDVMG_pbeZOT8DDzr6VrgE5nMjl6p9G8Atg-AikNpQHTKtKRIKNormjxLKD1X3J8rP_cpQjfXcaNZLVrSD836BtLis5lkXoKa-W8yOFtVoR9tQOeoZpztZ9iKfxiJ9xRRyXovOgU84VBZN-KN4a8SIUZ05mPnWbBC2df2E25Or",
  },
];

function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function getFeaturedPresentation(
  hospital: Hospital,
): FeaturedHospitalPresentation {
  const key = hospital.source_reference ?? "";

  return (
    featuredHospitalPresentation[key] ?? {
      badge: "Hospital Partner",
      icon: "verified" as const,
      description:
        "Rumah sakit mitra dengan layanan medis yang siap mendukung kebutuhan pasien internasional.",
      tags: [
        hospital.city?.name ?? "Malaysia",
        `${hospital.doctors_count} dokter`,
      ],
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCCSZczypQMo-X0NvL3Ss4l1s3CkRwnZhCIA_vIocQgyosWwLP1KGV4JjgmLf93Oe5micY-EZOR4T2-6DwezyE1YJGrByXByt-gV5Lon5W76YGnpjnw7QWgjYn25DMaEMv4l1e7lHmP5g_LGcv-oDiz_E9oj_67eYvPAJ0_mRnpU8gnwX_k-b7wx4RBUmW66Sy5iFbbBQTqcP4NcPJYswywZw-gVTF93Gpx2SPdLVG-XbDflMPI40m85lMfhpAJ-9Xm-agdSipWzmEq",
    }
  );
}

function getHospitalDetailPath(hospital: Hospital) {
  return `/rumah-sakit/${hospital.source_reference ?? hospital.id}`;
}

export default async function HospitalPage() {
  let featuredHospitals: Hospital[] = [];

  try {
    const payload = await getHospitals();
    featuredHospitals = payload.data ?? [];
  } catch {
    featuredHospitals = [];
  }

  return (
    <main className="min-h-screen bg-[#fcf8fb] font-[Inter,Arial,sans-serif] text-[#1b1b1d] antialiased">
      <SiteHeader active="hospitals" />

      <div className="pt-40">
        <section className="mx-auto mb-24 max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-[1.1] text-[#1b1b1d] md:text-5xl">
              Rumah Sakit Terbaik di Johor
            </h1>
            <p className="max-w-2xl text-lg leading-[1.6] text-[#5d5e63] md:text-[19px]">
              Temukan standar keunggulan medis kelas dunia di Johor. Kami
              bermitra dengan rumah sakit terkemuka untuk memastikan perjalanan
              medis Anda berjalan lancar, aman, dan nyaman dengan pendampingan
              penuh.
            </p>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {featuredHospitals.map((hospital) => {
              const presentation = getFeaturedPresentation(hospital);

              return (
                <article
                  key={hospital.id}
                  className="group relative flex flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] transition-transform duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-[400px] overflow-hidden">
                    <Image
                      alt={hospital.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src={presentation.image}
                    />
                  </div>
                  <div className="flex flex-grow flex-col p-8 md:p-10">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#2bb673]">
                          {presentation.badge}
                        </span>
                        <h2 className="text-2xl font-bold leading-[1.2] text-[#1b1b1d] md:text-[32px]">
                          {hospital.name}
                        </h2>
                      </div>
                      <Icon
                        name={presentation.icon}
                        className="!text-3xl text-[#2bb673]/40"
                      />
                    </div>

                    <p className="mb-8 text-base leading-[1.6] text-[#5d5e63]">
                      {presentation.description}
                    </p>

                    <div className="mb-10 flex flex-wrap gap-2">
                      {presentation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[#e0f2fe] px-3 py-1 text-xs font-semibold text-[#00568c]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={getHospitalDetailPath(hospital)}
                      className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-[#2bb673] py-4 font-semibold text-white shadow-lg shadow-[#2bb673]/20 transition-all hover:bg-[#249e63] active:scale-95"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
            {secondaryHospitals.map((hospital) => (
              <article
                key={hospital.name}
                className="group flex flex-col items-center gap-8 rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] md:flex-row"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl md:w-48">
                  <Image
                    alt={hospital.name}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(min-width: 768px) 192px, 100vw"
                    src={hospital.image}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-semibold leading-[1.3] text-[#1b1b1d]">
                    {hospital.name}
                  </h3>
                  <p className="mb-6 text-base leading-[1.6] text-[#5d5e63]">
                    {hospital.description}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 border-b-2 border-[#2bb673]/30 pb-1 text-sm font-bold text-[#00568c] transition-all group-hover:pr-2 hover:border-[#2bb673]"
                  >
                    Pelajari Selengkapnya
                    <Icon name="arrow_forward" className="!text-sm" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
