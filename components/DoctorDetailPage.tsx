"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChatBot from "@/components/shared/ChatBot";
import SiteHeader from "@/components/shared/SiteHeader";

type IconName =
  | "arrow_back"
  | "call"
  | "event_available"
  | "language"
  | "location_on"
  | "medical_services"
  | "person_search"
  | "school"
  | "verified";

type Doctor = {
  id: number;
  slug: string;
  name: string;
  title: string | null;
  specialization: string | null;
  photo_url: string | null;
  profile_url: string | null;
  hospital: {
    name: string;
    city: string;
    country: string;
  } | null;
  clinic_location: string | null;
  languages: string[];
  specialties: {
    slug: string;
    name: string;
  }[];
  consultation_hours_raw: string | null;
};

type DoctorsResponse = {
  data: Doctor[];
};

const DOCTORS_URL = "/api/doctors";

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

function getDoctorPath(doctor: Doctor) {
  return `/dokter/${doctor.slug || doctor.id}`;
}

function splitLines(value: string | null) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function DoctorDetailPage({ slug }: { slug: string }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDoctors() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(DOCTORS_URL, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Detail dokter belum bisa dimuat.");
        }

        const payload = (await response.json()) as DoctorsResponse;

        if (isMounted) {
          setDoctors(payload.data ?? []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Detail dokter belum bisa dimuat.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  const doctor = useMemo(() => {
    const decodedSlug = decodeURIComponent(slug);

    return doctors.find(
      (item) =>
        item.slug === decodedSlug ||
        String(item.id) === decodedSlug ||
        getDoctorPath(item).endsWith(`/${decodedSlug}`),
    );
  }, [doctors, slug]);

  const relatedDoctors = useMemo(() => {
    if (!doctor) {
      return [];
    }

    return doctors
      .filter((item) => {
        if (item.id === doctor.id) {
          return false;
        }

        const sameSpecialization =
          item.specialization &&
          doctor.specialization &&
          item.specialization === doctor.specialization;
        const sameHospital =
          item.hospital?.name &&
          doctor.hospital?.name &&
          item.hospital.name === doctor.hospital.name;

        return sameSpecialization || sameHospital;
      })
      .slice(0, 3);
  }, [doctor, doctors]);

  const consultationHours = splitLines(doctor?.consultation_hours_raw ?? null);
  const specialtyNames =
    doctor?.specialties.map((specialty) => specialty.name).filter(Boolean) ??
    [];

  return (
    <main className="min-h-screen bg-[#f9f9fb] font-[Inter,Arial,sans-serif] text-[#1a1c1d] antialiased">
      <SiteHeader active="doctors" />

      <section className="bg-black px-5 pb-12 pt-32 text-white md:px-8 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dokter"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <Icon name="arrow_back" />
            Kembali ke daftar dokter
          </Link>

          {isLoading ? (
            <div className="grid gap-10 md:grid-cols-[1fr_360px] md:items-end">
              <div className="h-56 animate-pulse rounded-3xl bg-white/10" />
              <div className="h-96 animate-pulse rounded-3xl bg-white/10" />
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-8 text-red-100">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && !doctor ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
              <Icon
                name="person_search"
                className="mb-4 !text-5xl text-white/40"
              />
              <h1 className="mb-3 text-3xl font-bold text-white">
                Dokter tidak ditemukan
              </h1>
              <p className="mx-auto max-w-xl text-white/70">
                Profil yang Anda buka belum tersedia di data dokter saat ini.
              </p>
            </div>
          ) : null}

          {doctor ? (
            <div className="grid gap-10 md:grid-cols-[1fr_360px] md:items-end">
              <div className="max-w-4xl">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Profil Dokter
                </p>
                <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-normal md:text-7xl">
                  {doctor.name}
                </h1>
                <p className="max-w-2xl text-xl leading-relaxed text-gray-300 md:text-2xl">
                  {doctor.specialization ??
                    "Spesialisasi dokter belum tersedia"}
                </p>
              </div>

              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-[#f3f3f5] md:mx-0">
                {doctor.photo_url ? (
                  <Image
                    alt={doctor.name}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 768px) 360px, 90vw"
                    src={doctor.photo_url}
                  />
                ) : (
                  <Icon
                    name="person_search"
                    className="absolute left-1/2 top-1/2 !text-6xl -translate-x-1/2 -translate-y-1/2 text-gray-300"
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {doctor ? (
        <section className="py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_380px] md:px-8">
            <div className="space-y-8">
              <section className="rounded-3xl border border-[#e2e2e4] bg-white p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Icon name="language" className="!text-2xl text-black" />
                  <h2 className="text-2xl font-bold text-black">
                    Bahasa yang digunakan
                  </h2>
                </div>
                {doctor.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full border border-gray-200 bg-[#f9f9fb] px-4 py-2 text-sm font-semibold text-[#4b4b4d]"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#5f5e60]">Bahasa belum tersedia.</p>
                )}
              </section>

              <section className="rounded-3xl border border-[#e2e2e4] bg-white p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Icon name="school" className="!text-2xl text-black" />
                  <h2 className="text-2xl font-bold text-black">
                    Pendidikan / Sertifikasi
                  </h2>
                </div>
                {doctor.title ? (
                  <p className="mb-5 text-base font-medium leading-relaxed text-[#4b4b4d]">
                    {doctor.title}
                  </p>
                ) : null}
                {specialtyNames.length > 0 ? (
                  <ul className="space-y-3">
                    {specialtyNames.map((specialty) => (
                      <li
                        key={specialty}
                        className="flex gap-3 text-base leading-relaxed text-[#4b4b4d]"
                      >
                        <Icon
                          name="verified"
                          className="mt-0.5 !text-xl text-gray-400"
                        />
                        <span>{specialty}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#5f5e60]">
                    Data pendidikan dan sertifikasi belum tersedia.
                  </p>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-3xl border border-[#e2e2e4] bg-white p-7">
                <h2 className="mb-6 text-2xl font-bold text-black">
                  Detail Klinik
                </h2>

                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Icon
                      name="location_on"
                      className="mt-0.5 !text-xl text-gray-400"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Lokasi Klinik
                      </p>
                      <p className="mt-1 text-base font-semibold leading-relaxed text-black">
                        {doctor.clinic_location ??
                          doctor.hospital?.name ??
                          "Lokasi belum tersedia"}
                      </p>
                      {doctor.hospital ? (
                        <p className="mt-1 text-sm leading-relaxed text-[#5f5e60]">
                          {doctor.hospital.name}, {doctor.hospital.city},{" "}
                          {doctor.hospital.country}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icon
                      name="call"
                      className="mt-0.5 !text-xl text-gray-400"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Telepon
                      </p>
                      <p className="mt-1 text-base font-semibold text-black">
                        Hubungi Concierge Prime
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Icon
                      name="event_available"
                      className="mt-0.5 !text-xl text-gray-400"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        Jam Konsultasi
                      </p>
                      {consultationHours.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {consultationHours.map((hour) => (
                            <p
                              key={hour}
                              className="text-sm font-medium leading-relaxed text-[#4b4b4d]"
                            >
                              {hour}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-[#5f5e60]">
                          Jadwal belum tersedia.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href="/#layanan"
                  className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Buat Janji Konsultasi
                </Link>
              </section>

              {relatedDoctors.length > 0 ? (
                <section className="rounded-3xl border border-[#e2e2e4] bg-white p-7">
                  <h2 className="mb-5 text-xl font-bold text-black">
                    Dokter Terkait
                  </h2>
                  <div className="space-y-4">
                    {relatedDoctors.map((relatedDoctor) => (
                      <Link
                        key={relatedDoctor.id}
                        href={getDoctorPath(relatedDoctor)}
                        className="flex gap-3 rounded-2xl border border-gray-100 p-3 transition hover:border-black"
                      >
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f3f3f5]">
                          {relatedDoctor.photo_url ? (
                            <Image
                              alt={relatedDoctor.name}
                              className="object-cover"
                              fill
                              sizes="56px"
                              src={relatedDoctor.photo_url}
                            />
                          ) : (
                            <Icon
                              name="person_search"
                              className="absolute left-1/2 top-1/2 !text-2xl -translate-x-1/2 -translate-y-1/2 text-gray-300"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-bold leading-snug text-black">
                            {relatedDoctor.name}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-[#5f5e60]">
                            {relatedDoctor.specialization ??
                              "Spesialisasi belum tersedia"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </section>
      ) : null}

      <ChatBot />
    </main>
  );
}
