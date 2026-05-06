import Image from "next/image";

type IconName =
  | "analytics"
  | "calendar_month"
  | "keyboard_arrow_down"
  | "concierge"
  | "mail"
  | "payments"
  | "receipt_long"
  | "route"
  | "person_search"
  | "share"
  | "magic_button"
  | "support_agent"
  | "travel_explore";

const destinations = ["Melaka", "Johor Bahru", "Penang", "Kuala Lumpur"];

const painPoints = [
  {
    icon: "person_search" as const,
    title: "Bingung pilih dokter",
    text: "Ratusan spesialis tersedia, namun mana yang paling tepat untuk kondisi spesifik Anda?",
  },
  {
    icon: "payments" as const,
    title: "Tidak tahu estimasi biaya",
    text: "Biaya tersembunyi seringkali mengganggu perencanaan finansial keluarga Anda.",
  },
  {
    icon: "route" as const,
    title: "Takut proses rumit",
    text: "Dari paspor, hotel, hingga bahasa, birokrasi medis tidak seharusnya menjadi beban Anda.",
  },
];

const solutions = [
  {
    icon: "magic_button" as const,
    title: "Kurasi Dokter Terbaik",
    text: "Kami mencocokkan riwayat medis Anda dengan profil dokter paling berprestasi di Malaysia.",
  },
  {
    icon: "analytics" as const,
    title: "Transparansi Finansial",
    text: "Dapatkan rincian estimasi biaya pengobatan sebelum Anda meninggalkan rumah.",
  },
  {
    icon: "concierge" as const,
    title: "Concierge 24/7",
    text: "Asisten pribadi yang mendampingi setiap langkah Anda, memastikan kenyamanan total.",
  },
];

const services = [
  {
    icon: "calendar_month" as const,
    title: "Booking Dokter",
    text: "Janji temu prioritas dengan spesialis terpilih tanpa antrean panjang.",
  },
  {
    icon: "receipt_long" as const,
    title: "Estimasi Biaya",
    text: "Analisis biaya yang akurat membantu Anda merencanakan segalanya dengan matang.",
  },
  {
    icon: "travel_explore" as const,
    title: "Transport & Hotel",
    text: "Pemesanan akomodasi dan transportasi privat yang ramah pasien.",
  },
  {
    icon: "support_agent" as const,
    title: "Pendampingan",
    text: "Staf lokal kami akan mendampingi Anda langsung di rumah sakit di Malaysia.",
  },
];

const hospitals = [
  {
    name: "Mahkota Medical Centre",
    location: "Melaka, Malaysia",
  },
  {
    name: "Regency Specialist Hospital",
    location: "Johor Bahru, Malaysia",
  },
];

const whatsappUrl = "https://wa.me/";

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f9f9fb] font-[Inter,Arial,sans-serif] text-[#1a1c1d] antialiased">
      <header className="fixed top-0 z-50 w-full border-b border-gray-100/50 bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <a
            href="#"
            aria-label="Concierge Prime"
            className="text-xl font-semibold tracking-tight text-black"
          >
            Concierge Prime
          </a>

          <nav className="hidden items-center gap-10 text-base font-medium md:flex">
            <a
              className="border-b-2 border-black pb-1 text-black"
              href="#layanan"
            >
              Layanan
            </a>
            <a
              className="text-gray-500 transition hover:text-black"
              href="#rumah-sakit"
            >
              Rumah Sakit
            </a>
            <a
              className="text-gray-500 transition hover:text-black"
              href="#testimoni"
            >
              Testimoni
            </a>
            <a
              className="text-gray-500 transition hover:text-black"
              href="#tentang"
            >
              Tentang Kami
            </a>
          </nav>

          <a
            href={whatsappUrl}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition active:scale-95 md:px-6"
          >
            Konsultasi Gratis
          </a>
        </div>
      </header>

      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Premium Hospital Environment"
            className="object-cover opacity-60"
            fill
            priority
            sizes="100vw"
            src="/assets/hero-hospital.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center md:px-8">
          <span className="mb-8 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            Eksklusif Ke Malaysia
          </span>
          <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-normal text-white md:text-7xl lg:text-8xl">
            Berobat ke Malaysia <br className="hidden md:block" />
            Tanpa Ribet
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            Dari konsultasi hingga kepulangan, kami urus semuanya. Fokuslah pada
            kesembuhan Anda, biarkan kami menangani logistiknya.
          </p>

          <div className="mb-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-white/60">
              Pilih Destinasi:
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {destinations.map((destination) => (
                <a
                  key={destination}
                  href={whatsappUrl}
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {destination}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href={whatsappUrl}
              className="inline-flex min-h-[68px] items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-bold text-black shadow-2xl transition hover:bg-gray-200 active:scale-95"
            >
              Konsultasi Gratis
            </a>
            <a
              href={whatsappUrl}
              className="inline-flex min-h-[68px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Cek Estimasi Biaya
            </a>
          </div>
        </div>

        <div className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 md:flex">
          <span className="text-[10px] uppercase tracking-widest">
            Scroll untuk mengeksplor
          </span>
          <Icon name="keyboard_arrow_down" className="animate-bounce" />
        </div>
      </section>

      <section id="tentang" className="bg-[#f9f9fb] py-24 md:py-[120px]">
        <div className="mx-auto mb-20 max-w-7xl px-5 text-center md:mb-24 md:px-8">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-black md:text-[32px]">
            Mengapa Mengurus Sendiri Begitu Menantang?
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#5f5e60] md:text-[19px]">
            Kami memahami keraguan yang sering muncul saat mencari pengobatan di
            luar negeri.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-3 md:gap-12 md:px-8">
          {painPoints.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-[#e2e2e4] bg-white p-8 transition hover:-translate-y-1 md:p-10"
            >
              <Icon
                name={item.icon}
                className="mb-8 block !text-4xl text-black"
              />
              <h3 className="mb-4 text-2xl font-semibold leading-snug text-black">
                {item.title}
              </h3>
              <p className="leading-relaxed text-[#5f5e60]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-black py-24 text-white md:py-[120px]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 px-5 md:flex-row md:gap-20 md:px-8">
          <div className="flex-1">
            <h2 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
              Solusi Cerdas, Tanpa Kompromi.
            </h2>
            <div className="space-y-12">
              {solutions.map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon name={item.icon} className="text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-2xl font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="leading-relaxed text-gray-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex-1">
            <div className="relative aspect-square overflow-hidden rounded-[3rem]">
              <Image
                alt="A professional medical concierge assisting patients in a VIP lounge"
                className="object-cover"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                src="/assets/concierge-lounge.jpg"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-white py-24 md:py-[120px]">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-16 md:mb-20">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-black md:text-[32px]">
              Layanan Tanpa Batas
            </h2>
            <p className="text-lg leading-relaxed text-[#5f5e60] md:text-[19px]">
              Didesain untuk ketenangan pikiran Anda dan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="group rounded-3xl border border-[#e2e2e4] bg-[#f9f9fb] p-8 transition duration-500 hover:bg-black"
              >
                <Icon
                  name={service.icon}
                  className="mb-6 block !text-3xl text-black transition group-hover:text-white"
                />
                <h3 className="mb-4 text-2xl font-semibold leading-snug text-black transition group-hover:text-white">
                  {service.title}
                </h3>
                <p className="leading-relaxed text-[#5f5e60] transition group-hover:text-gray-400">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="rumah-sakit"
        className="border-y border-[#e2e2e4] bg-[#f3f3f5] py-24"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-[#5f5e60]">
            Mitra Rumah Sakit Utama Kami
          </p>
          <div className="flex flex-wrap items-center justify-center gap-16 opacity-60 grayscale transition duration-700 hover:opacity-100 hover:grayscale-0 md:gap-32">
            {hospitals.map((hospital) => (
              <div key={hospital.name} className="text-center">
                <span className="block text-2xl font-bold tracking-normal text-black">
                  {hospital.name}
                </span>
                <span className="mt-1 block text-xs text-[#5f5e60]">
                  {hospital.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="testimoni"
        className="overflow-hidden bg-white py-24 md:py-[120px]"
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#f9f9fb] p-8 md:rounded-[4rem] md:p-24">
            <div className="relative z-10 grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
              <div className="relative">
                <span
                  className="absolute -left-6 -top-12 text-7xl font-black leading-none text-black/10"
                  aria-hidden="true"
                >
                  &quot;
                </span>
                <h2 className="mb-8 text-3xl font-bold italic leading-tight text-black md:text-[32px]">
                  &quot;Saya tidak perlu memikirkan apapun selain kesembuhan
                  istri saya. Segalanya sudah diatur dengan sangat elegan.&quot;
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-[#5f5e60] md:text-[19px]">
                  Proses pendaftaran dokter hingga penjemputan di bandara Kuala
                  Lumpur berjalan mulus. Pendamping kami sangat memahami
                  prosedur rumah sakit, membuat kami merasa seperti di rumah
                  sendiri.
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative size-16 overflow-hidden rounded-full border-2 border-white shadow-lg">
                    <Image
                      alt="A portrait of a middle-aged gentleman"
                      className="object-cover"
                      fill
                      sizes="64px"
                      src="/assets/patient-portrait.jpg"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-black">Bapak Aris Subakti</p>
                    <p className="text-sm text-[#5f5e60]">
                      Pasien Kardiologi, 2023
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="relative aspect-square rotate-3 overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    alt="A bright and airy clinical consultation room"
                    className="object-cover"
                    fill
                    sizes="50vw"
                    src="/assets/consultation-room.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-24 text-white md:py-[120px]">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <h2 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">
            Mulai Perjalanan Medis Anda Hari Ini
          </h2>
          <p className="mb-12 text-lg leading-relaxed text-[#c6c6c6] md:text-[19px]">
            Konsultasi awal 100% gratis. Kami siap membantu Anda menemukan jalan
            terbaik menuju kesembuhan.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <a
              href={whatsappUrl}
              className="inline-flex min-h-[68px] items-center justify-center rounded-full bg-white px-10 py-5 font-bold text-black transition hover:bg-gray-100"
            >
              Konsultasi Gratis
            </a>
            <a
              href={whatsappUrl}
              className="inline-flex min-h-[68px] items-center justify-center rounded-full border border-white/30 px-10 py-5 font-bold text-white transition hover:bg-white/10"
            >
              Hubungi Lewat WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-gray-50 px-5 py-16 text-sm leading-relaxed md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 text-lg font-bold tracking-normal text-black">
              Concierge Prime
            </div>
            <p className="mb-6 max-w-xs text-gray-500">
              Penyedia layanan manajemen medis premium untuk pasien
              internasional di Malaysia.
            </p>
            <div className="flex gap-4">
              <Icon
                name="share"
                className="cursor-pointer text-gray-400 transition hover:text-black"
              />
              <Icon
                name="mail"
                className="cursor-pointer text-gray-400 transition hover:text-black"
              />
            </div>
          </div>
          <div>
            <h3 className="mb-6 font-semibold text-black">Layanan</h3>
            <ul className="space-y-4 text-gray-500">
              {services.map((service) => (
                <li key={service.title}>
                  <a className="transition hover:text-black" href="#layanan">
                    {service.title === "Pendampingan"
                      ? "Pendampingan Pasien"
                      : service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-semibold text-black">Rumah Sakit</h3>
            <ul className="space-y-4 text-gray-500">
              {hospitals.map((hospital) => (
                <li key={hospital.name}>
                  <a
                    className="transition hover:text-black"
                    href="#rumah-sakit"
                  >
                    {hospital.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-6 font-semibold text-black">Kontak</h3>
            <p className="text-gray-500">
              Graha Prime Lt. 4
              <br />
              Jl. Sudirman No. 12
              <br />
              Jakarta Selatan
            </p>
            <p className="mt-4 font-semibold text-gray-500">
              +62 812 3456 7890
            </p>
          </div>
        </div>
        <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 text-gray-400 md:flex-row">
          <p>Copyright 2024 Concierge Prime. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="transition hover:text-black" href="#">
              Kebijakan Privasi
            </a>
            <a className="transition hover:text-black" href="#">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
