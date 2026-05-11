import Image from "next/image";
import Link from "next/link";
import ChatBot from "@/components/shared/ChatBot";
import SiteHeader from "@/components/shared/SiteHeader";

type IconName =
  | "arrow_back"
  | "calendar_month"
  | "location_on"
  | "medical_services"
  | "payments"
  | "support_agent"
  | "verified";

const whatsappUrl = "https://wa.me/";

const hospitals = [
  {
    name: "Mahkota Medical Centre",
    city: "Melaka, Malaysia",
    description:
      "Rumah sakit pilihan pasien internasional dengan layanan spesialis lengkap, lokasi strategis, dan proses administrasi yang ramah pasien Indonesia.",
    specialties: ["Kardiologi", "Onkologi", "Ortopedi", "Gastroenterologi"],
    highlights: ["Tim internasional", "Estimasi biaya", "Pendampingan pasien"],
  },
  {
    name: "Regency Specialist Hospital",
    city: "Johor Bahru, Malaysia",
    description:
      "Fasilitas medis modern di Johor Bahru untuk konsultasi, pemeriksaan lanjutan, tindakan spesialis, dan rawat inap terencana.",
    specialties: ["Neurologi", "Urologi", "Bedah Umum", "THT"],
    highlights: ["Akses dekat Singapura", "Booking dokter", "Koordinasi hotel"],
  },
  {
    name: "Island Hospital",
    city: "Penang, Malaysia",
    description:
      "Rumah sakit rujukan populer di Penang dengan pilihan dokter spesialis yang luas untuk kebutuhan second opinion dan medical check-up.",
    specialties: ["Medical Check-Up", "Mata", "Endokrin", "Kanker"],
    highlights: ["Second opinion", "Paket pemeriksaan", "Rencana perjalanan"],
  },
  {
    name: "Gleneagles Hospital Kuala Lumpur",
    city: "Kuala Lumpur, Malaysia",
    description:
      "Rumah sakit premium di pusat Kuala Lumpur untuk pasien yang membutuhkan akses spesialis, fasilitas nyaman, dan koordinasi perjalanan medis.",
    specialties: ["Jantung", "Saraf", "Wanita & Anak", "Rehabilitasi"],
    highlights: ["Fasilitas premium", "Dokter spesialis", "Transport privat"],
  },
];

const supportItems = [
  {
    icon: "medical_services" as const,
    title: "Pilih Spesialis",
    text: "Kami bantu cocokkan keluhan, diagnosis awal, dan riwayat medis dengan rumah sakit yang tepat.",
  },
  {
    icon: "calendar_month" as const,
    title: "Atur Jadwal",
    text: "Tim kami koordinasikan slot dokter, kebutuhan dokumen, dan estimasi durasi kunjungan.",
  },
  {
    icon: "support_agent" as const,
    title: "Dampingi Proses",
    text: "Mulai dari persiapan, kedatangan, pendaftaran, hingga tindak lanjut setelah konsultasi.",
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

export default function HospitalPage() {
  return (
    <main className="min-h-screen bg-[#f9f9fb] font-[Inter,Arial,sans-serif] text-[#1a1c1d] antialiased">
      <SiteHeader active="hospitals" />

      <section className="relative overflow-hidden bg-black pt-20 text-white">
        <div className="absolute inset-0">
          <Image
            alt="Lingkungan rumah sakit modern untuk pasien internasional"
            className="object-cover opacity-55"
            fill
            priority
            sizes="100vw"
            src="/assets/hero-hospital.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-20">
          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <Icon name="arrow_back" />
            Kembali ke beranda
          </Link>

          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Mitra Rumah Sakit Malaysia
            </p>
            <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-normal md:text-7xl">
              Rumah sakit pilihan untuk perjalanan medis Anda
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Bandingkan lokasi, spesialisasi, dan dukungan pasien sebelum
              menentukan rumah sakit yang paling sesuai dengan kebutuhan medis
              keluarga.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-3 md:px-8">
          {supportItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#e2e2e4] bg-[#f9f9fb] p-7"
            >
              <Icon name={item.icon} className="mb-5 block !text-3xl text-black" />
              <h2 className="mb-3 text-xl font-semibold text-black">
                {item.title}
              </h2>
              <p className="leading-relaxed text-[#5f5e60]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f3f5] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#5f5e60]">
                Direktori Rumah Sakit
              </p>
              <h2 className="text-3xl font-bold leading-tight text-black md:text-[32px]">
                Pilihan rumah sakit utama
              </h2>
            </div>
            <a
              href={whatsappUrl}
              className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Minta Rekomendasi
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {hospitals.map((hospital) => (
              <article
                key={hospital.name}
                className="rounded-3xl border border-[#e2e2e4] bg-white p-6 md:p-8"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="mb-3 text-2xl font-bold leading-snug text-black">
                      {hospital.name}
                    </h3>
                    <p className="flex items-center gap-2 text-sm font-medium text-[#5f5e60]">
                      <Icon name="location_on" className="!text-xl" />
                      {hospital.city}
                    </p>
                  </div>
                  <Icon name="verified" className="!text-3xl text-black" />
                </div>

                <p className="mb-6 leading-relaxed text-[#5f5e60]">
                  {hospital.description}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="grid gap-3 border-t border-gray-100 pt-6 sm:grid-cols-3">
                  {hospital.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2">
                      <Icon name="payments" className="!text-xl text-gray-400" />
                      <span className="text-sm font-medium text-[#1a1c1d]">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            Butuh bantuan memilih rumah sakit?
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-[#c6c6c6]">
            Ceritakan keluhan, diagnosis awal, usia pasien, dan kota tujuan.
            Tim kami akan bantu arahkan pilihan rumah sakit dan dokter yang
            paling relevan.
          </p>
          <a
            href={whatsappUrl}
            className="inline-flex min-h-[60px] items-center justify-center rounded-full bg-white px-9 py-4 font-bold text-black transition hover:bg-gray-100"
          >
            Konsultasi Gratis
          </a>
        </div>
      </section>

      <ChatBot />
    </main>
  );
}
