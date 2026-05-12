import Image from "next/image";
import Link from "next/link";
import { getDoctorsByHospitalId } from "@/lib/doctors";
import SiteHeader from "@/components/shared/SiteHeader";
import type { Doctor } from "@/types/doctor";
import type { Hospital } from "@/types/hospital";

type IconName =
  | "arrow_forward"
  | "call"
  | "cardiology"
  | "check"
  | "neurology"
  | "oncology"
  | "orthopedics"
  | "schedule";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdKITFRpsRJVK-wCDGRKdU6ut8TwsQDNbjNuhAkPQ2oZUrydAtbLWFcpSQeuoaGXCn6jba7NJm-eCZVMXg8fncEcLoGE8h78rEQvOA0tuhsrOfQKeQ7h4k_FhAojOXu5X2IYOY7iFaVUAdv2Vlv-sb7CBw1GhU2GieNtpiiV0QT4-wSJ27zN_D-FCXFYRargzRXZMw2V_4EI4pBubgPEcOtJdVbWVxnM0ckmsqJniUHvLWVTroLXXBLL7HHspitXX30Et-S1AM32zQ";
const suiteImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDum99_x0LO8XhbiNSnsrj9GRo-NY2Qe8Ug1P-k7OJCE9us2yBUAEGX8hPLvqKiUDvkHSrCD540kA9EoVvEo42goJFxGKuvBZZEQLEnqbL9CqOgHZXaP-Bpm0hX8r0tL0Ek3ZSSc13-kbSVtOI84Sv9jjEToTDyKWP0ngv8v0x0KpJh9SbfcPYf63g5G8Xkj7xsPceeu3FZOZlwbKv7y_bVNbhWMek-gXw_4TRiB88DmwFry1-ySxOtGApM0weSnTA2jZnzc3RUphxF";
const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC5I7X1sVbReJ-ePhZROq8Iqwnx2J_D2fVbch7Ct56nzHlt4IEHh3K9nK-GAvOSaC8-Sw0MG3396xKPZSat2nrUc2k5NVCRrqrCAieW8p-Xf51I1aIw02gzuWSX0B1iNomO360jTK4z-1inzFYQ8DaKkgnQytyzslK_tXUo0fPWW-jXP_Lrx_EkirRiwUk8FnFW23MHMI1sdxo2uWZAvXN0pg5eeWu-ZyEFQCMTCaYb1e-JwPfHDCQveEDs7im1Lzcjhl3LOKgDgawb";

const excellenceCenters = [
  {
    icon: "cardiology" as const,
    title: "Jantung & Pembuluh Darah",
    text: "Prosedur kardiologi intervensi tercanggih dengan tim bedah toraks berpengalaman internasional.",
    featured: true,
  },
  {
    icon: "oncology" as const,
    title: "Kanker",
    text: "Terapi onkologi personalisasi dengan fokus pada kenyamanan dan efektivitas pemulihan.",
    featured: false,
  },
  {
    icon: "neurology" as const,
    title: "Bedah Saraf",
    text: "Penanganan presisi tinggi untuk gangguan neurologis kompleks menggunakan teknologi navigasi otak.",
    featured: false,
  },
  {
    icon: "orthopedics" as const,
    title: "Ortopedi",
    text: "Solusi komprehensif untuk mobilitas, dari penggantian sendi hingga cedera olahraga profesional.",
    featured: true,
  },
];

const facilities = [
  {
    number: "01",
    title: "Kamar Rawat Inap VVIP",
    text: "Suite privat yang dirancang dengan estetika modern, menawarkan kenyamanan layaknya hotel bintang lima untuk pasien dan pendamping.",
  },
  {
    number: "02",
    title: "Pusat Diagnostik Canggih",
    text: "Peralatan pencitraan medis generasi terbaru untuk akurasi diagnosis yang tajam dan cepat.",
  },
  {
    number: "03",
    title: "Layanan Pasien Internasional",
    text: "Tim pendamping khusus yang membantu koordinasi logistik, bahasa, dan administrasi pasien global.",
  },
];

const packages = [
  {
    name: "Basic",
    price: "RM 450",
    featured: false,
    items: [
      "Konsultasi Dokter Umum",
      "Pemeriksaan Fisik Lengkap",
      "Tes Profil Darah Dasar",
      "Urinalisis",
    ],
  },
  {
    name: "Executive",
    price: "RM 1,200",
    featured: true,
    items: [
      "Semua fitur Paket Basic",
      "ECG & Stress Test",
      "USG Abdomen & Pelvis",
      "Profil Lipid & Gula Darah",
    ],
  },
  {
    name: "Premier",
    price: "RM 2,800",
    featured: false,
    items: [
      "Semua fitur Executive",
      "Penilaian Risiko Kardiovaskular",
      "MRI Screening Opsional",
      "Konsultasi Spesialis Senior",
    ],
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

function formatLocation(hospital: Hospital) {
  if (!hospital.city) {
    return "Malaysia";
  }

  return `${hospital.city.name}, ${hospital.city.country}`;
}

export default async function HospitalDetailPage({
  hospital,
}: {
  hospital: Hospital;
}) {
  let doctors: Doctor[] = [];

  try {
    const payload = await getDoctorsByHospitalId(hospital.id);
    doctors = (payload.data ?? []).slice(0, 3);
  } catch {
    doctors = [];
  }

  return (
    <main className="min-h-screen bg-[#fcf8fb] font-[Inter,Arial,sans-serif] text-[#1b1b1d] antialiased">
      <SiteHeader active="hospitals" />

      <section className="relative h-[870px] w-full overflow-hidden pt-20">
        <div className="absolute inset-0 top-20">
          <Image
            alt={`Eksterior ${hospital.name}`}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-24 md:px-16">
          <span className="mb-6 w-fit rounded-full border border-white/30 bg-[#00568c]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            Premium Partner
          </span>
          <h1 className="mb-4 max-w-5xl text-5xl font-bold leading-[1.1] text-white md:text-6xl">
            {hospital.name}
          </h1>
          <p className="max-w-2xl text-lg leading-[1.6] text-white/90">
            Pusat medis terkemuka di {formatLocation(hospital)} dengan fasilitas
            lengkap dan pelayanan standar internasional.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] bg-white px-5 py-24 md:px-16 md:py-[120px]">
        <div className="max-w-4xl">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
            Overview
          </h2>
          <p className="text-3xl font-semibold leading-relaxed text-[#1b1b1d] md:text-[32px]">
            Berdiri dengan komitmen terhadap keunggulan klinis, {hospital.name}{" "}
            menjadi pusat layanan medis premium yang memadukan teknologi modern,
            koordinasi pasien internasional, dan pengalaman perawatan yang
            tenang dari awal hingga akhir.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-16 md:py-[120px]">
        <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
          Pusat Keunggulan
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {excellenceCenters.map((center) => (
            <article
              key={center.title}
              className={`rounded-xl border border-[#e5e5e7] bg-white p-8 transition duration-500 hover:border-[#00568c] md:p-10 ${
                center.featured ? "md:col-span-2" : ""
              }`}
            >
              <Icon name={center.icon} className="mb-6 block !text-4xl text-[#2bb673]" />
              <h3 className="mb-4 text-2xl font-semibold leading-[1.3]">
                {center.title}
              </h3>
              <p className="max-w-lg leading-[1.6] text-[#5d5e63]">{center.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] overflow-hidden px-5 py-24 md:px-16 md:py-[120px]">
        <div className="flex flex-col items-center gap-16 md:flex-row md:gap-20">
          <div className="w-full md:w-1/2">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
              Fasilitas Unggulan
            </h2>
            <ul className="space-y-12">
              {facilities.map((facility) => (
                <li key={facility.number} className="flex items-start gap-6">
                  <span className="mt-1 text-xs font-bold text-[#2bb673]">
                    {facility.number}
                  </span>
                  <div>
                    <h3 className="mb-2 text-2xl font-semibold leading-[1.3]">
                      {facility.title}
                    </h3>
                    <p className="leading-[1.6] text-[#5d5e63]">{facility.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
              <Image
                alt="Suite rawat inap premium"
                className="object-cover"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                src={suiteImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3f5] px-5 py-24 md:px-16 md:py-[120px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
              Health Screening
            </h2>
            <h3 className="text-3xl font-semibold md:text-[32px]">
              Paket Pemeriksaan Kesehatan
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.name}
                className={`relative flex flex-col rounded-xl p-8 transition duration-300 md:p-10 ${
                  item.featured
                    ? "scale-[1.02] bg-[#00568c] text-white shadow-2xl md:scale-105"
                    : "border border-[#e5e5e7] bg-white hover:scale-[1.02]"
                }`}
              >
                {item.featured ? (
                  <span className="absolute right-6 top-6 rounded-full bg-[#2bb673] px-2 py-1 text-[10px] font-bold uppercase text-white">
                    Populer
                  </span>
                ) : null}
                <span className={`mb-2 font-medium ${item.featured ? "text-white/70" : "text-[#00568c]"}`}>
                  {item.name}
                </span>
                <div className="mb-8 text-4xl font-bold">
                  {item.price}
                  <span className={`text-sm font-normal ${item.featured ? "text-white/70" : "text-[#5d5e63]"}`}>
                    /estimasi
                  </span>
                </div>
                <ul className={`mb-12 flex-grow space-y-4 text-sm ${item.featured ? "text-white/80" : "text-[#5d5e63]"}`}>
                  {item.items.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Icon name="check" className="!text-sm text-[#2bb673]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`w-full rounded-lg py-4 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    item.featured
                      ? "bg-[#2bb673] text-white hover:opacity-90"
                      : "bg-[#f0edef] text-[#1b1b1d] hover:bg-[#eae7ea]"
                  }`}
                >
                  Pilih Paket
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {doctors.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-16 md:py-[120px]">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
            Spesialis Senior
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {doctors.map((doctor) => (
              <article key={doctor.id} className="group">
                <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                  {doctor.photo_url ? (
                    <Image
                      alt={doctor.name}
                      className="object-cover"
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      src={doctor.photo_url}
                    />
                  ) : null}
                </div>
                <h3 className="mb-1 text-2xl font-semibold leading-[1.3]">
                  {doctor.name}
                </h3>
                <p className="text-sm font-medium text-[#00568c]">
                  {doctor.specialization ?? "Spesialis Rumah Sakit"}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-[#e5e5e7] bg-white px-5 py-24 md:px-16 md:py-[120px]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
              Lokasi & Kontak
            </h2>
            <div className="mb-10">
              <p className="mb-4 text-2xl font-semibold leading-[1.3]">
                {hospital.name}
              </p>
              <p className="mb-6 leading-relaxed text-[#5d5e63]">
                {formatLocation(hospital)}
                <br />
                Malaysia.
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-3 text-sm">
                  <Icon name="schedule" className="text-[#00568c]" />
                  24 Jam (Layanan Gawat Darurat)
                </p>
                <p className="flex items-center gap-3 text-sm">
                  <Icon name="call" className="text-[#00568c]" />
                  +607-381 7700
                </p>
              </div>
            </div>
            <Link
              href={hospital.source_url ?? "/rumah-sakit"}
              className="inline-flex items-center gap-3 rounded-full bg-[#2bb673] px-8 py-5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
            >
              Hubungi Layanan Pasien Internasional
              <Icon name="arrow_forward" className="!text-sm" />
            </Link>
          </div>

          <div className="relative h-96 overflow-hidden rounded-2xl border border-[#00568c]/10 shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
            <Image
              alt={`Peta lokasi ${hospital.name}`}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              src={mapImage}
            />
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-[#e5e5e7] bg-[#f6f3f5] px-5 py-20 md:px-16">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 text-lg font-bold tracking-tight text-[#00568c]">
              Concierge Prime
            </div>
            <p className="text-xs leading-relaxed tracking-wide text-zinc-500">
              Copyright 2024 Concierge Prime. High-end medical coordination.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-xs tracking-wide text-zinc-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>International Support</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
