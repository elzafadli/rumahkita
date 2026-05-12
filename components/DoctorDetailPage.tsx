"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChatBot from "@/components/shared/ChatBot";
import SiteHeader from "@/components/shared/SiteHeader";
import { getDoctorConsultationWhatsAppUrl } from "@/lib/whatsapp";

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
    <main className="min-h-screen bg-[#fcf8fb] font-[Inter,Arial,sans-serif] text-[#1b1b1d] antialiased">
      <SiteHeader active="doctors" />

      <section className="px-5 pt-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dokter"
            className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#006d40] transition hover:text-[#004024]"
          >
            <Icon name="arrow_back" className="!text-xl" />
            Kembali ke daftar dokter
          </Link>
        </div>
      </section>

      {isLoading ? (
        <section className="px-5 pb-14 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_420px]">
            <div className="h-[440px] animate-pulse rounded-2xl bg-[#f0edef]" />
            <div className="h-[520px] animate-pulse rounded-2xl bg-[#f0edef]" />
          </div>
        </section>
      ) : null}

      {!isLoading && error ? (
        <section className="px-5 pb-14 md:px-8">
          <div className="mx-auto max-w-7xl rounded-xl border border-red-100 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        </section>
      ) : null}

      {!isLoading && !error && !doctor ? (
        <section className="px-5 pb-14 md:px-8">
          <div className="mx-auto max-w-7xl rounded-xl border border-[#f2f2f7] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <Icon
              name="person_search"
              className="mb-4 !text-5xl text-[#9fa0a5]"
            />
            <h1 className="mb-3 text-3xl font-semibold text-[#1b1b1d]">
              Dokter tidak ditemukan
            </h1>
            <p className="mx-auto max-w-xl text-[#3d4a40]">
              Profil yang Anda buka belum tersedia di data dokter saat ini.
            </p>
          </div>
        </section>
      ) : null}

      {doctor ? (
        <>
          <section className="relative overflow-hidden px-5 pb-16 md:px-8">
            <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_430px] md:items-stretch">
              <div className="flex min-h-[560px] flex-col justify-end rounded-2xl border border-[#bccabd]/30 bg-white p-8 shadow-[0_40px_100px_rgba(0,0,0,0.03)] md:p-12">
                <span className="mb-6 inline-flex w-fit rounded-full border border-[#006d40]/20 bg-[#00568c]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#00568c]">
                  Profil Dokter
                </span>
                <h1 className="mb-5 max-w-4xl text-4xl font-bold leading-[1.1] tracking-normal text-[#1b1b1d] md:text-6xl">
                  {doctor.name}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#3d4a40] md:text-xl">
                  {doctor.specialization ??
                    "Spesialisasi dokter belum tersedia"}
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["medical_services", "Spesialisasi", doctor.specialization],
                    [
                      "location_on",
                      "Rumah Sakit",
                      doctor.hospital?.name ?? "Belum tersedia",
                    ],
                    [
                      "language",
                      "Bahasa",
                      doctor.languages.length > 0
                        ? doctor.languages.slice(0, 2).join(", ")
                        : "Belum tersedia",
                    ],
                  ].map(([icon, label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-[#e5e5e7] bg-[#fcf8fb] p-4"
                    >
                      <Icon
                        name={icon as IconName}
                        className="mb-3 !text-3xl text-[#2bb673]"
                      />
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#00568c]">
                        {label}
                      </p>
                      <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-[#1b1b1d]">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[560px] overflow-hidden rounded-2xl bg-[#f0edef] shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
                {doctor.photo_url ? (
                  <Image
                    alt={doctor.name}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 768px) 430px, 90vw"
                    src={doctor.photo_url}
                  />
                ) : (
                  <Icon
                    name="person_search"
                    className="absolute left-1/2 top-1/2 !text-6xl -translate-x-1/2 -translate-y-1/2 text-[#9fa0a5]"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2bb673] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    <Icon name="verified" className="!text-xs" />
                    Terkurasi
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white px-5 py-20 md:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                Overview
              </h2>
              <p className="max-w-4xl text-2xl font-semibold leading-relaxed text-[#1b1b1d] md:text-3xl">
                {doctor.title
                  ? doctor.title
                  : `${doctor.name} tersedia dalam direktori Concierge Prime untuk membantu Anda menemukan rujukan dokter sesuai kebutuhan medis.`}
              </p>
            </div>
          </section>

          <section className="px-5 py-20 md:px-8">
            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_420px]">
              <div>
                <h2 className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                  Keahlian & Bahasa
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <section className="rounded-xl border border-[#e5e5e7] bg-white p-8 transition duration-300 hover:border-[#00568c] md:col-span-2">
                    <Icon
                      name="school"
                      className="mb-6 !text-4xl text-[#2bb673]"
                    />
                    <h3 className="mb-4 text-2xl font-semibold text-[#1b1b1d]">
                      Pendidikan / Sertifikasi
                    </h3>
                    {specialtyNames.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {specialtyNames.map((specialty) => (
                          <span
                            key={specialty}
                            className="rounded-md bg-[#f0edef] px-3 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#3d4a40]"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="leading-relaxed text-[#3d4a40]">
                        Data pendidikan dan sertifikasi belum tersedia.
                      </p>
                    )}
                  </section>

                  <section className="rounded-xl border border-[#e5e5e7] bg-white p-8 transition duration-300 hover:border-[#00568c]">
                    <Icon
                      name="language"
                      className="mb-6 !text-4xl text-[#2bb673]"
                    />
                    <h3 className="mb-4 text-2xl font-semibold text-[#1b1b1d]">
                      Bahasa
                    </h3>
                    {doctor.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((language) => (
                          <span
                            key={language}
                            className="rounded-full bg-[#f0edef] px-4 py-2 text-sm font-semibold text-[#3d4a40]"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="leading-relaxed text-[#3d4a40]">
                        Bahasa belum tersedia.
                      </p>
                    )}
                  </section>

                  <section className="rounded-xl border border-[#e5e5e7] bg-white p-8 transition duration-300 hover:border-[#00568c]">
                    <Icon
                      name="medical_services"
                      className="mb-6 !text-4xl text-[#2bb673]"
                    />
                    <h3 className="mb-4 text-2xl font-semibold text-[#1b1b1d]">
                      Fokus Praktik
                    </h3>
                    <p className="leading-relaxed text-[#3d4a40]">
                      {doctor.specialization ??
                        "Fokus praktik belum tersedia."}
                    </p>
                  </section>
                </div>
              </div>

              <aside className="space-y-6">
                <section className="rounded-xl border border-[#e5e5e7] bg-white p-8 shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
                  <h2 className="mb-8 text-3xl font-semibold leading-tight text-[#1b1b1d]">
                    Detail Klinik
                  </h2>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <Icon
                        name="location_on"
                        className="mt-1 !text-2xl text-[#00568c]"
                      />
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                          Lokasi
                        </p>
                        <p className="font-semibold leading-relaxed text-[#1b1b1d]">
                          {doctor.clinic_location ??
                            doctor.hospital?.name ??
                            "Lokasi belum tersedia"}
                        </p>
                        {doctor.hospital ? (
                          <p className="mt-2 text-sm leading-relaxed text-[#3d4a40]">
                            {doctor.hospital.name}, {doctor.hospital.city},{" "}
                            {doctor.hospital.country}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Icon
                        name="event_available"
                        className="mt-1 !text-2xl text-[#00568c]"
                      />
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                          Jam Konsultasi
                        </p>
                        {consultationHours.length > 0 ? (
                          <div className="space-y-2">
                            {consultationHours.map((hour) => (
                              <p
                                key={hour}
                                className="text-sm font-medium leading-relaxed text-[#3d4a40]"
                              >
                                {hour}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#3d4a40]">
                            Jadwal belum tersedia.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Icon
                        name="call"
                        className="mt-1 !text-2xl text-[#00568c]"
                      />
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                          Kontak
                        </p>
                        <p className="font-semibold text-[#1b1b1d]">
                          Hubungi Concierge Prime
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={getDoctorConsultationWhatsAppUrl(doctor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#2bb673] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#006d40]"
                  >
                    Buat Janji Konsultasi
                  </a>
                </section>
              </aside>
            </div>
          </section>

          {relatedDoctors.length > 0 ? (
            <section className="border-t border-[#e5e5e7] bg-white px-5 py-20 md:px-8">
              <div className="mx-auto max-w-7xl">
                <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-[#00568c]">
                  Dokter Terkait
                </h2>
                <div className="grid gap-8 md:grid-cols-3">
                  {relatedDoctors.map((relatedDoctor) => (
                    <Link
                      key={relatedDoctor.id}
                      href={getDoctorPath(relatedDoctor)}
                      className="group block"
                    >
                      <div className="mb-6 aspect-[3/4] overflow-hidden rounded-2xl bg-[#f0edef]">
                        {relatedDoctor.photo_url ? (
                          <Image
                            alt={relatedDoctor.name}
                            className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                            height={640}
                            width={480}
                            src={relatedDoctor.photo_url}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Icon
                              name="person_search"
                              className="!text-5xl text-[#9fa0a5]"
                            />
                          </div>
                        )}
                      </div>
                      <h3 className="mb-1 text-2xl font-semibold leading-tight text-[#1b1b1d]">
                        {relatedDoctor.name}
                      </h3>
                      <p className="text-sm font-medium text-[#00568c]">
                        {relatedDoctor.specialization ??
                          "Spesialisasi belum tersedia"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <ChatBot />
    </main>
  );
}
