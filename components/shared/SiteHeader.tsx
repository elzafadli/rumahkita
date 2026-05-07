import Link from "next/link";

type ActiveNav = "home" | "doctors" | "hospitals";

const whatsappUrl = "https://wa.me/";

const navItems = [
  { key: "home", label: "Beranda", href: "/" },
  { key: "doctors", label: "Dokter", href: "/dokter" },
  { key: "hospitals", label: "Rumah Sakit", href: "/rumah-sakit" },
  { key: "services", label: "Layanan", href: "/#layanan" },
  { key: "testimonials", label: "Testimoni", href: "/#testimoni" },
] as const;

export default function SiteHeader({ active }: { active: ActiveNav }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-100/50 bg-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          aria-label="Concierge Prime"
          className="text-xl font-semibold tracking-tight text-black"
        >
          Concierge Prime
        </Link>

        <nav className="hidden items-center gap-8 text-base font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              className={
                item.key === active
                  ? "border-b-2 border-black pb-1 text-black"
                  : "text-gray-500 transition hover:text-black"
              }
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappUrl}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition active:scale-95 md:px-6"
        >
          Konsultasi Gratis
        </a>
      </div>
    </header>
  );
}
