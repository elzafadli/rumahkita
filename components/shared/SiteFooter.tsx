type IconName = "mail" | "share";

const serviceLinks = [
  "Booking Dokter",
  "Estimasi Biaya",
  "Transport & Hotel",
  "Pendampingan Pasien",
];

const hospitalLinks = [
  "Mahkota Medical Centre",
  "Regency Specialist Hospital",
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

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-5 py-16 text-sm leading-relaxed md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-6 text-lg font-bold tracking-normal text-black">
            Concierge Prime
          </div>
          <p className="mb-6 max-w-xs text-gray-500">
            Penyedia layanan manajemen medis premium untuk pasien internasional
            di Malaysia.
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
            {serviceLinks.map((service) => (
              <li key={service}>
                <Link className="transition hover:text-black" href="/#layanan">
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 font-semibold text-black">Rumah Sakit</h3>
          <ul className="space-y-4 text-gray-500">
            {hospitalLinks.map((hospital) => (
              <li key={hospital}>
                <Link
                  className="transition hover:text-black"
                  href="/#rumah-sakit"
                >
                  {hospital}
                </Link>
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
            Syarat &amp; Ketentuan
          </a>
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";
