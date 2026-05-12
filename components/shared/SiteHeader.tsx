"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAssistantWhatsAppUrl } from "@/lib/whatsapp";
import type { Hospital, HospitalsResponse } from "@/types/hospital";

type ActiveNav = "home" | "doctors" | "hospitals";

const whatsappMessage = `Halo, Saya ingin konsultasi dengan Kantor Perwakilan Resmi Mahkota Medical Centre dan Regency Specialist Hospital.

Mohon bantuannya untuk konsultasi lebih lanjut. Terima kasih`;
const whatsappUrl = getAssistantWhatsAppUrl(whatsappMessage);

const navItems = [
  { key: "home", label: "Beranda", href: "/" },
  { key: "hospitals", label: "Rumah Sakit", href: "/rumah-sakit" },
  { key: "doctors", label: "Dokter", href: "/dokter" },
  { key: "services", label: "Layanan", href: "/#layanan" },
  { key: "testimonials", label: "Testimoni", href: "/#testimoni" },
] as const;

export default function SiteHeader({ active }: { active: ActiveNav }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHospitalMenuOpen, setIsHospitalMenuOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hasLoadedHospitals, setHasLoadedHospitals] = useState(false);
  const hospitalMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHospitalMenuOpen || hasLoadedHospitals) {
      return;
    }

    let isMounted = true;

    async function loadHospitals() {
      try {
        const response = await fetch("/api/hospitals", {
          headers: { Accept: "application/json" },
        });
        const payload = (await response.json()) as HospitalsResponse;

        if (isMounted && response.ok) {
          setHospitals(payload.data ?? []);
        }
      } catch {
        if (isMounted) {
          setHospitals([]);
        }
      } finally {
        if (isMounted) {
          setHasLoadedHospitals(true);
        }
      }
    }

    loadHospitals();

    return () => {
      isMounted = false;
    };
  }, [hasLoadedHospitals, isHospitalMenuOpen]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        hospitalMenuRef.current &&
        !hospitalMenuRef.current.contains(event.target as Node)
      ) {
        setIsHospitalMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function getHospitalHref(hospital: Hospital) {
    return `/rumah-sakit/${hospital.source_reference ?? hospital.id}`;
  }

  function closeMenus() {
    setIsHospitalMenuOpen(false);
    setIsMobileMenuOpen(false);
  }

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
          {navItems.map((item) => {
            if (item.key === "hospitals" && active === "hospitals") {
              return (
                <div
                  key={item.key}
                  ref={hospitalMenuRef}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-expanded={isHospitalMenuOpen}
                    aria-haspopup="menu"
                    className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-black"
                    onClick={() => setIsHospitalMenuOpen((open) => !open)}
                  >
                    {item.label}
                    <span
                      className={`material-symbols-outlined !text-base transition ${
                        isHospitalMenuOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      keyboard_arrow_down
                    </span>
                  </button>

                  {isHospitalMenuOpen ? (
                    <div
                      role="menu"
                      className="absolute left-0 top-full mt-4 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
                    >
                      {hasLoadedHospitals && hospitals.length === 0 ? (
                        <div className="px-3 py-3 text-sm text-gray-500">
                          Daftar rumah sakit belum tersedia.
                        </div>
                      ) : null}

                      {!hasLoadedHospitals ? (
                        <div className="px-3 py-3 text-sm text-gray-500">
                          Memuat daftar rumah sakit...
                        </div>
                      ) : null}

                      {hospitals.map((hospital) => (
                        <Link
                          key={hospital.id}
                          role="menuitem"
                          href={getHospitalHref(hospital)}
                          className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black"
                          onClick={() => setIsHospitalMenuOpen(false)}
                        >
                          <span className="block font-medium">
                            {hospital.name}
                          </span>
                          {hospital.city ? (
                            <span className="mt-1 block text-xs text-gray-500">
                              {hospital.city.name}, {hospital.city.country}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            return (
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
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition active:scale-95 sm:inline-flex md:px-6"
          >
            Konsultasi Gratis
          </a>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="site-mobile-menu"
            className="inline-flex size-11 items-center justify-center rounded-full border border-gray-200 text-black transition active:scale-95 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div
          id="site-mobile-menu"
          className="border-t border-gray-100 bg-white px-5 pb-6 pt-3 shadow-[0_24px_60px_rgba(0,0,0,0.08)] md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 text-base font-medium">
            {navItems.map((item) => {
              if (item.key === "hospitals" && active === "hospitals") {
                return (
                  <div key={item.key}>
                    <button
                      type="button"
                      aria-expanded={isHospitalMenuOpen}
                      aria-haspopup="menu"
                      className="flex min-h-12 w-full items-center justify-between border-b border-gray-100 text-left text-black"
                      onClick={() => setIsHospitalMenuOpen((open) => !open)}
                    >
                      <span className="border-b-2 border-black py-3">
                        {item.label}
                      </span>
                      <span
                        className={`material-symbols-outlined transition ${
                          isHospitalMenuOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        keyboard_arrow_down
                      </span>
                    </button>

                    {isHospitalMenuOpen ? (
                      <div
                        role="menu"
                        className="max-h-80 overflow-y-auto border-b border-gray-100 py-2"
                      >
                        {hasLoadedHospitals && hospitals.length === 0 ? (
                          <div className="px-3 py-3 text-sm text-gray-500">
                            Daftar rumah sakit belum tersedia.
                          </div>
                        ) : null}

                        {!hasLoadedHospitals ? (
                          <div className="px-3 py-3 text-sm text-gray-500">
                            Memuat daftar rumah sakit...
                          </div>
                        ) : null}

                        {hospitals.map((hospital) => (
                          <Link
                            key={hospital.id}
                            role="menuitem"
                            href={getHospitalHref(hospital)}
                            className="block rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-black"
                            onClick={closeMenus}
                          >
                            <span className="block font-medium">
                              {hospital.name}
                            </span>
                            {hospital.city ? (
                              <span className="mt-1 block text-xs text-gray-500">
                                {hospital.city.name}, {hospital.city.country}
                              </span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  key={item.key}
                  className={
                    item.key === active
                      ? "border-b border-gray-100 py-3 text-black"
                      : "border-b border-gray-100 py-3 text-gray-600 transition hover:text-black"
                  }
                  href={item.href}
                  onClick={closeMenus}
                >
                  {item.label}
                </Link>
              );
            })}

            <a
              href={whatsappUrl}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition active:scale-95 sm:hidden"
              onClick={closeMenus}
            >
              Konsultasi Gratis
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
