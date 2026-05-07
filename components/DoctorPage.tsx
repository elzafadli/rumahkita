"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChatBot from "@/components/ChatBot";
import SiteHeader from "@/components/shared/SiteHeader";

type IconName =
  | "arrow_back"
  | "chevron_left"
  | "chevron_right"
  | "filter_list"
  | "language"
  | "location_on"
  | "medical_services"
  | "person_search"
  | "search"
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
  meta?: {
    total?: number;
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const DOCTORS_URL = `${API_BASE_URL.replace(/\/$/, "")}/2/doctors`;
const PAGE_SIZE = 12;

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

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export default function DoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);

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
          throw new Error("Data dokter belum bisa dimuat.");
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
              : "Data dokter belum bisa dimuat.",
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

  const filterOptions = useMemo(() => {
    const specializations = uniqueSorted(
      doctors.flatMap((doctor) => [
        doctor.specialization ?? "",
        ...doctor.specialties.map((specialty) => specialty.name),
      ]),
    );
    const hospitals = uniqueSorted(
      doctors.map((doctor) =>
        doctor.hospital
          ? `${doctor.hospital.name} - ${doctor.hospital.city}`
          : "",
      ),
    );
    const languages = uniqueSorted(doctors.flatMap((doctor) => doctor.languages));

    return { specializations, hospitals, languages };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const hospitalName = doctor.hospital
        ? `${doctor.hospital.name} ${doctor.hospital.city} ${doctor.hospital.country}`
        : "";
      const specialtyNames = doctor.specialties
        .map((specialty) => specialty.name)
        .join(" ");
      const searchableText = [
        doctor.name,
        doctor.specialization,
        hospitalName,
        doctor.clinic_location,
        specialtyNames,
        doctor.languages.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" || searchableText.includes(normalizedSearch);
      const matchesSpecialization =
        specialization === "" ||
        doctor.specialization === specialization ||
        doctor.specialties.some((specialty) => specialty.name === specialization);
      const matchesHospital =
        hospital === "" ||
        (doctor.hospital
          ? `${doctor.hospital.name} - ${doctor.hospital.city}` === hospital
          : false);
      const matchesLanguage =
        language === "" || doctor.languages.includes(language);

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesHospital &&
        matchesLanguage
      );
    });
  }, [doctors, hospital, language, search, specialization]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleDoctors = filteredDoctors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function clearFilters() {
    setSearch("");
    setSpecialization("");
    setHospital("");
    setLanguage("");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#f9f9fb] font-[Inter,Arial,sans-serif] text-[#1a1c1d] antialiased">
      <SiteHeader active="doctors" />

      <section className="bg-black px-5 pb-16 pt-32 text-white md:px-8 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
          >
            <Icon name="arrow_back" />
            Kembali ke beranda
          </Link>

          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Direktori Dokter
            </p>
            <h1 className="mb-8 text-5xl font-bold leading-[1.05] tracking-normal md:text-7xl">
              Temukan dokter yang sesuai dengan kebutuhan medis Anda
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Cari berdasarkan nama, spesialisasi, rumah sakit, kota, atau
              bahasa. Semua filter berjalan langsung di halaman ini.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e2e2e4] bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:px-8">
          <label className="relative block">
            <span className="sr-only">Cari dokter</span>
            <Icon
              name="search"
              className="absolute left-4 top-1/2 !text-xl -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-full border border-gray-200 bg-[#f9f9fb] pl-12 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black"
              placeholder="Cari nama, spesialisasi, kota..."
            />
          </label>

          <label>
            <span className="sr-only">Filter spesialisasi</span>
            <select
              value={specialization}
              onChange={(event) => {
                setSpecialization(event.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-full border border-gray-200 bg-[#f9f9fb] px-4 text-sm text-black outline-none transition focus:border-black"
            >
              <option value="">Semua spesialisasi</option>
              {filterOptions.specializations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter rumah sakit</span>
            <select
              value={hospital}
              onChange={(event) => {
                setHospital(event.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-full border border-gray-200 bg-[#f9f9fb] px-4 text-sm text-black outline-none transition focus:border-black"
            >
              <option value="">Semua rumah sakit</option>
              {filterOptions.hospitals.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter bahasa</span>
            <select
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                setPage(1);
              }}
              className="h-12 w-full rounded-full border border-gray-200 bg-[#f9f9fb] px-4 text-sm text-black outline-none transition focus:border-black"
            >
              <option value="">Semua bahasa</option>
              {filterOptions.languages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gray-200 px-5 text-sm font-semibold text-black transition hover:border-black"
          >
            <Icon name="filter_list" className="!text-xl" />
            Reset
          </button>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-[#5f5e60]">
                {isLoading
                  ? "Memuat data dokter..."
                  : `${filteredDoctors.length} dokter ditemukan dari ${doctors.length} data`}
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-black md:text-[32px]">
                Daftar dokter
              </h2>
            </div>
            <p className="text-sm font-medium text-[#5f5e60]">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-red-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-3xl border border-[#e2e2e4] bg-white"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && visibleDoctors.length === 0 ? (
            <div className="rounded-3xl border border-[#e2e2e4] bg-white p-10 text-center">
              <Icon
                name="person_search"
                className="mb-4 !text-5xl text-gray-300"
              />
              <h3 className="mb-2 text-2xl font-semibold text-black">
                Dokter tidak ditemukan
              </h3>
              <p className="text-[#5f5e60]">
                Coba ubah kata kunci atau reset filter untuk melihat lebih
                banyak pilihan.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && visibleDoctors.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleDoctors.map((doctor) => (
                  <article
                    key={doctor.id}
                    className="overflow-hidden rounded-3xl border border-[#e2e2e4] bg-white"
                  >
                    <div className="flex gap-5 p-6">
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-[#f3f3f5]">
                        {doctor.photo_url ? (
                          <Image
                            alt={doctor.name}
                            className="object-cover"
                            fill
                            sizes="96px"
                            src={doctor.photo_url}
                          />
                        ) : (
                          <Icon
                            name="person_search"
                            className="absolute left-1/2 top-1/2 !text-4xl -translate-x-1/2 -translate-y-1/2 text-gray-300"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-xl font-bold leading-snug text-black">
                          {doctor.name}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm font-medium text-[#5f5e60]">
                          {doctor.specialization ?? "Spesialisasi belum tersedia"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-gray-100 px-6 py-5">
                      <div className="flex gap-3">
                        <Icon
                          name="location_on"
                          className="mt-0.5 !text-xl text-gray-400"
                        />
                        <p className="text-sm leading-relaxed text-[#5f5e60]">
                          {doctor.hospital
                            ? `${doctor.hospital.name}, ${doctor.hospital.city}`
                            : "Rumah sakit belum tersedia"}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Icon
                          name="language"
                          className="mt-0.5 !text-xl text-gray-400"
                        />
                        <p className="line-clamp-2 text-sm leading-relaxed text-[#5f5e60]">
                          {doctor.languages.length > 0
                            ? doctor.languages.join(", ")
                            : "Bahasa belum tersedia"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(doctor.specialties.length > 0
                          ? doctor.specialties.slice(0, 3)
                          : [{ slug: "specialization", name: doctor.specialization }]
                        ).map((specialty, index) =>
                          specialty.name ? (
                            <span
                              key={`${specialty.slug}-${specialty.name}-${index}`}
                              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600"
                            >
                              {specialty.name}
                            </span>
                          ) : null,
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                        <Icon name="verified" className="!text-lg" />
                        Profil Dokter
                      </div>
                      {doctor.profile_url ? (
                        <a
                          href={doctor.profile_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          Detail
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#e2e2e4] pt-8 md:flex-row">
                <p className="text-sm font-medium text-[#5f5e60]">
                  Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, filteredDoctors.length)}{" "}
                  dari {filteredDoctors.length} dokter
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                    className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-black transition hover:border-black disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="Halaman sebelumnya"
                  >
                    <Icon name="chevron_left" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;

                    if (
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      Math.abs(pageNumber - currentPage) > 1
                    ) {
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="px-2 text-sm text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                          pageNumber === currentPage
                            ? "bg-black text-white"
                            : "border border-gray-200 text-black hover:border-black"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setPage((value) => Math.min(totalPages, value + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-black transition hover:border-black disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="Halaman berikutnya"
                  >
                    <Icon name="chevron_right" />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <ChatBot />
    </main>
  );
}
