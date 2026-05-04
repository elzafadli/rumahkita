const cities = [
  "Penang",
  "Melaka",
  "Kuala Lumpur",
  "Johor Bahru",
  "Kuching",
  "Singapura",
];

const pressLogos = [
  "Akurat.co",
  "Berita Satu",
  "Bisnis",
  "Bisnis Indonesia",
  "Brilio",
  "JPNN",
  "Liputan 6",
  "Sindo News",
  "Suara",
  "Tribun News",
];

const services = [
  "Memberikan rekomendasi dokter",
  "Memberikan perkiraan biaya berobat",
  "Mengecek jadwal dokter",
  "Membuat appointment",
  "Mengatur jemputan bandara",
  "Booking hotel",
];

const testimonials = [
  {
    name: "Kik*******auw",
    city: "Luwu Timur",
    date: "16 April 2026",
    quote: "Makasi pelayanan dr medisata sangat baik dan rajin balas wa aku",
  },
  {
    name: "Mei*******gna",
    city: "Medan",
    date: "4 Maret 2026",
    quote:
      "Saya sangat puas sekali dengan bantuan dan pelayanan dari dr. Citra dari tim Medisata. Panduan yang diberikan sangat jelas sehingga proses pengobatan berjalan lancar.",
  },
  {
    name: "Efi*******Shu",
    city: "Medan",
    date: "27 Februari 2026",
    quote:
      "Dr. Hani di Medisata sangat membantu di dalam proses appointment saya dengan dokter-dokter di Penang selama proses pengobatan kanker payudara saya.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6fbff] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="MediSata">
            <span className="grid size-10 place-items-center rounded-md bg-[#1b9bd7] text-xl font-bold text-white">
              M
            </span>
            <span className="text-2xl font-bold tracking-tight text-[#1b9bd7]">
              MediSata
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <a href="#" className="text-[#0b7eb6]">
              Home
            </a>
            <a href="#destinasi">Pilihan RS</a>
            <a href="#checkup">Paket Check Up</a>
            <a href="#layanan">Tentang Kami</a>
          </nav>

          <a
            href="https://wa.me/"
            className="rounded-md bg-[#25d366] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1fb85a]"
          >
            Butuh Bantuan?
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[#e8f6fc] lg:block" />
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-md bg-sky-50 px-3 py-1 text-sm font-bold text-[#0b7eb6]">
              Perwakilan RS Malaysia dan Singapura di Indonesia
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-normal text-slate-950 md:text-6xl">
              Dapatkan Layanan Medis Kelas Dunia dengan Biaya Terjangkau
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Konsultasi tujuan berobat, pilihan dokter, jadwal, estimasi biaya,
              appointment, jemputan bandara, sampai booking hotel.
            </p>

            <div
              id="destinasi"
              className="mt-8 max-w-3xl rounded-lg border border-sky-100 bg-white p-5 shadow-xl shadow-sky-900/5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-normal text-slate-500">
                    Pilih Destinasi Berobat
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">
                    Pilih kota tujuan
                  </h2>
                </div>
                <a
                  href="https://wa.me/"
                  className="rounded-md border border-[#1b9bd7] px-4 py-2.5 text-center text-sm font-bold text-[#0b7eb6] transition hover:bg-sky-50"
                >
                  Chat rekomendasi
                </a>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((city) => (
                  <a
                    key={city}
                    href="#"
                    className="group flex min-h-14 items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 transition hover:border-[#1b9bd7] hover:bg-white"
                  >
                    <span>{city}</span>
                    <span className="text-[#1b9bd7] transition group-hover:translate-x-1">
                      -&gt;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 min-h-[440px]">
            <div className="absolute left-0 top-8 h-72 w-72 rounded-full bg-[#f5d36b]/50 blur-3xl" />
            <div className="absolute bottom-4 right-0 h-72 w-72 rounded-full bg-[#8fd1ea]/70 blur-3xl" />
            <div className="relative ml-auto grid max-w-lg gap-4">
              <div className="rounded-lg bg-[#0b7eb6] p-6 text-white shadow-2xl shadow-sky-900/20">
                <div className="h-56 rounded-md bg-[linear-gradient(135deg,#e8f6fc_0%,#ffffff_48%,#bce6f5_100%)] p-5">
                  <div className="grid h-full grid-cols-[1fr_0.75fr] gap-4">
                    <div className="rounded-md bg-white/85 p-4 shadow-sm">
                      <div className="mb-4 h-4 w-24 rounded bg-[#1b9bd7]" />
                      <div className="space-y-2">
                        <div className="h-3 rounded bg-slate-200" />
                        <div className="h-3 w-4/5 rounded bg-slate-200" />
                        <div className="h-3 w-3/5 rounded bg-slate-200" />
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-2">
                        <div className="h-12 rounded bg-[#e7f7ef]" />
                        <div className="h-12 rounded bg-[#fff5d6]" />
                        <div className="h-12 rounded bg-[#e8f6fc]" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-end rounded-md bg-[#f7c94b] p-4">
                      <div className="h-16 rounded-t-full bg-white/85" />
                      <div className="h-24 rounded-b-md bg-white/85" />
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-2xl font-extrabold">100%</p>
                    <p className="text-sky-100">Bebas biaya</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">6</p>
                    <p className="text-sky-100">Destinasi</p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">24/7</p>
                    <p className="text-sky-100">Bantuan WA</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-sky-100 bg-white p-5 shadow-xl shadow-sky-900/5">
                <p className="text-sm font-bold text-slate-500">
                  Layanan kami 100% bebas biaya
                </p>
                <p className="mt-2 text-lg font-bold text-slate-950">
                  Tim dokter membantu memilih rumah sakit dan dokter yang
                  sesuai keluhan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/70 py-8">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-center text-sm font-bold text-slate-500">
            Medisata telah diliput di:
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {pressLogos.map((logo) => (
              <div
                key={logo}
                className="grid min-h-16 place-items-center rounded-md border border-sky-100 bg-white px-3 text-center text-sm font-bold text-slate-500 shadow-sm"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-[#0b7eb6]">
              Layanan Medisata
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-slate-950 md:text-5xl">
              Perwakilan Rumah Sakit Malaysia dan Singapura di Indonesia
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Dari rekomendasi dokter hingga akomodasi, layanan dirancang agar
              pasien bisa fokus pada pengobatan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service}
                className="flex min-h-24 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#1b9bd7] text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                <p className="self-center text-lg font-bold text-slate-800">
                  {service}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6fbff] py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-normal text-[#0b7eb6]">
              Apa kata pasien tentang Medisata?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-5xl">
              Ini Cerita Mereka . . .
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-lg border border-sky-100 bg-white p-6 shadow-lg shadow-sky-900/5"
              >
                <div className="mb-5 text-4xl font-black text-[#f7c94b]">
                  &quot;
                </div>
                <p className="min-h-32 text-base leading-7 text-slate-700">
                  {item.quote}
                </p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h3 className="font-extrabold text-slate-950">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {item.city} - {item.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b7eb6] py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-normal md:text-4xl">
              Butuh rekomendasi rumah sakit, cek jadwal, atau minta perkiraan
              biaya?
            </h2>
            <p className="mt-4 text-lg leading-8 text-sky-100">
              Silakan masukan pertanyaan atau keluhan Anda, tim dokter kami akan
              segera membantu.
            </p>
          </div>
          <a
            href="https://wa.me/"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 text-base font-extrabold text-[#0b7eb6] transition hover:bg-sky-50"
          >
            Hubungi Kami
          </a>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-4 md:px-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-[#1b9bd7] text-xl font-bold text-white">
                M
              </span>
              <span className="text-2xl font-bold text-white">MediSata</span>
            </div>
            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              Layanan pendamping pasien untuk berobat ke Malaysia dan Singapura.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">Informasi</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <a href="#">Hubungi Kami</a>
              <a href="#">Disclaimer</a>
              <a href="#">Blog</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white">Social</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">YouTube</a>
              <a href="#">TikTok</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-sm text-slate-500 md:px-8">
          All rights reserved. Medisata © 2026.
        </div>
      </footer>
    </main>
  );
}
