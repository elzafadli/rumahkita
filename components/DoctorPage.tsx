"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import ChatBot from "@/components/shared/ChatBot";
import SiteHeader from "@/components/shared/SiteHeader";
import { getDoctorConsultationWhatsAppUrl } from "@/lib/whatsapp";
import type { Doctor } from "@/types/doctor";

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

const PAGE_SIZE = 12;

type FilterOption = {
  label: string;
  value: string;
};

const selectStyles: StylesConfig<FilterOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    border: 0,
    borderRadius: 8,
    backgroundColor: "#f0edef",
    boxShadow: state.isFocused ? "0 0 0 2px #1b6299" : "none",
    cursor: "pointer",
    transition: "box-shadow 150ms ease, background-color 150ms ease",
    "&:hover": {
      backgroundColor: "#e9e6e8",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px 0 16px",
  }),
  input: (base) => ({
    ...base,
    color: "#1b1b1d",
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#1b1b1d",
    fontSize: 14,
    fontWeight: 600,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6d7a6f",
    fontSize: 14,
    fontWeight: 600,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: 8,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#1b6299" : "#3d4a40",
    padding: 6,
    transition: "transform 150ms ease, color 150ms ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : undefined,
    "&:hover": {
      color: "#1b6299",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#3d4a40",
    padding: 6,
    "&:hover": {
      color: "#006d40",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 50,
    overflow: "hidden",
    borderRadius: 8,
    border: "1px solid rgba(188, 202, 189, 0.65)",
    boxShadow: "0 18px 40px rgba(27, 27, 29, 0.12)",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: 260,
    padding: 6,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 6,
    backgroundColor: state.isSelected
      ? "#2bb673"
      : state.isFocused
        ? "#e4f6eb"
        : "transparent",
    color: state.isSelected ? "#004024" : "#1b1b1d",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: state.isSelected ? 700 : 500,
    "&:active": {
      backgroundColor: "#5cde97",
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#3d4a40",
    fontSize: 14,
  }),
};

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

function formatHospitalOption(doctor: Doctor) {
  return doctor.hospital
    ? `${doctor.hospital.name}, ${doctor.hospital.city}`
    : "";
}

function toSelectOptions(allLabel: string, values: string[]) {
  return [
    { label: allLabel, value: "" },
    ...values.map((value) => ({ label: value, value })),
  ];
}

function FilterSelect({
  ariaLabel,
  instanceId,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  instanceId: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <Select<FilterOption, false>
      aria-label={ariaLabel}
      classNamePrefix="doctor-filter"
      instanceId={instanceId}
      isClearable
      isSearchable
      noOptionsMessage={() => "Tidak ada opsi"}
      onChange={(option: SingleValue<FilterOption>) => {
        onChange(option?.value ?? "");
      }}
      options={options}
      placeholder={options[0]?.label}
      styles={selectStyles}
      value={selectedOption}
    />
  );
}

export default function DoctorPage({
  initialDoctors,
  initialError = "",
}: {
  initialDoctors: Doctor[];
  initialError?: string;
}) {
  const doctors = initialDoctors;
  const isLoading = false;
  const error = initialError;
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);

  const filterOptions = useMemo(() => {
    const specializations = uniqueSorted(
      doctors.flatMap((doctor) => [
        doctor.specialization ?? "",
        ...doctor.specialties.map((specialty) => specialty.name),
      ]),
    );
    const hospitals = uniqueSorted(
      doctors.map((doctor) => formatHospitalOption(doctor)),
    );
    const languages = uniqueSorted(
      doctors.flatMap((doctor) => doctor.languages),
    );

    return { specializations, hospitals, languages };
  }, [doctors]);

  const specializationOptions = useMemo(
    () => toSelectOptions("Semua spesialisasi", filterOptions.specializations),
    [filterOptions.specializations],
  );
  const hospitalOptions = useMemo(
    () => toSelectOptions("Semua rumah sakit", filterOptions.hospitals),
    [filterOptions.hospitals],
  );
  const languageOptions = useMemo(
    () => toSelectOptions("Semua bahasa", filterOptions.languages),
    [filterOptions.languages],
  );

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
        doctor.specialties.some(
          (specialty) => specialty.name === specialization,
        );
      const matchesHospital =
        hospital === "" ||
        (doctor.hospital ? formatHospitalOption(doctor) === hospital : false);
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
    <main className="min-h-screen bg-[#fcf8fb] font-[Inter,Arial,sans-serif] text-[#1b1b1d] antialiased">
      <SiteHeader active="doctors" />

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-[104px] md:px-8">
        <section className="py-8 md:py-10">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold leading-[1.1] tracking-normal text-[#1b1b1d] md:text-5xl">
              Temukan Dokter Spesialis Terbaik
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#3d4a40]">
              Akses ke jaringan dokter spesialis terkemuka, dikurasi untuk
              kebutuhan kesehatan Anda dengan pencarian dan filter yang tetap
              berjalan langsung di halaman ini.
            </p>
          </div>
        </section>

        <section className="sticky top-24 z-30 mb-10 rounded-xl border border-[#bccabd]/40 bg-white/85 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-2xl">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Cari dokter</span>
              <Icon
                name="search"
                className="absolute left-4 top-1/2 !text-xl -translate-y-1/2 text-[#3d4a40]"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-12 w-full rounded-lg border-none bg-[#f0edef] pl-12 pr-4 text-sm text-[#1b1b1d] outline-none ring-1 ring-transparent transition placeholder:text-[#6d7a6f] focus:ring-2 focus:ring-[#1b6299]"
                placeholder="Cari nama, spesialisasi, kota..."
              />
            </label>

            <label>
              <span className="sr-only">Filter spesialisasi</span>
              <FilterSelect
                ariaLabel="Filter spesialisasi"
                instanceId="doctor-specialization-filter"
                options={specializationOptions}
                value={specialization}
                onChange={(value) => {
                  setSpecialization(value);
                  setPage(1);
                }}
              />
            </label>

            <label>
              <span className="sr-only">Filter rumah sakit</span>
              <FilterSelect
                ariaLabel="Filter rumah sakit"
                instanceId="doctor-hospital-filter"
                options={hospitalOptions}
                value={hospital}
                onChange={(value) => {
                  setHospital(value);
                  setPage(1);
                }}
              />
            </label>

            <label>
              <span className="sr-only">Filter bahasa</span>
              <FilterSelect
                ariaLabel="Filter bahasa"
                instanceId="doctor-language-filter"
                options={languageOptions}
                value={language}
                onChange={(value) => {
                  setLanguage(value);
                  setPage(1);
                }}
              />
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#006d40]/10 bg-[#2bb673] px-5 text-sm font-bold text-[#004024] transition hover:bg-[#5cde97]"
            >
              <Icon name="filter_list" className="!text-xl" />
              Reset
            </button>
          </div>
        </section>

        <section>
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-[#3d4a40]">
                {isLoading
                  ? "Memuat data dokter..."
                  : `${filteredDoctors.length} dokter ditemukan dari ${doctors.length} data`}
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#1b1b1d] md:text-[32px]">
                Daftar dokter
              </h2>
            </div>
            <p className="text-sm font-medium text-[#3d4a40]">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-red-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[500px] animate-pulse rounded-xl border border-[#f2f2f7] bg-white"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && visibleDoctors.length === 0 ? (
            <div className="rounded-xl border border-[#f2f2f7] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <Icon
                name="person_search"
                className="mb-4 !text-5xl text-[#9fa0a5]"
              />
              <h3 className="mb-2 text-2xl font-semibold text-[#1b1b1d]">
                Dokter tidak ditemukan
              </h3>
              <p className="text-[#3d4a40]">
                Coba ubah kata kunci atau reset filter untuk melihat lebih
                banyak pilihan.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && visibleDoctors.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visibleDoctors.map((doctor) => (
                  <article
                    key={doctor.id}
                    className="flex flex-col rounded-xl border border-[#f2f2f7] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                  >
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-[#f0edef]">
                      {doctor.photo_url ? (
                        <Image
                          alt={doctor.name}
                          className="object-cover"
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          src={doctor.photo_url}
                        />
                      ) : (
                        <Icon
                          name="person_search"
                          className="absolute left-1/2 top-1/2 !text-6xl -translate-x-1/2 -translate-y-1/2 text-[#9fa0a5]"
                        />
                      )}
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#006d40]/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        <Icon name="verified" className="!text-xs" />
                        TERKURASI
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h3 className="mb-2 line-clamp-2 text-2xl font-semibold leading-[1.3] text-[#1b1b1d]">
                        {doctor.name}
                      </h3>

                      <div className="mb-2 flex items-start gap-2 text-[#006d40]">
                        <Icon
                          name="medical_services"
                          className="mt-1 !text-base"
                        />
                        <p className="line-clamp-2 text-base font-medium leading-relaxed">
                          {doctor.specialization ??
                            "Spesialisasi belum tersedia"}
                        </p>
                      </div>

                      <div className="mb-3 flex items-start gap-2 text-[#3d4a40]">
                        <Icon
                          name="location_on"
                          className="mt-1 !text-base text-[#6d7a6f]"
                        />
                        <p className="line-clamp-2 text-base leading-relaxed">
                          {doctor.hospital
                            ? `${doctor.hospital.name}, ${doctor.hospital.city}`
                            : "Rumah sakit belum tersedia"}
                        </p>
                      </div>

                      <div className="mb-5 flex items-start gap-2 text-[#3d4a40]">
                        <Icon
                          name="language"
                          className="mt-1 !text-base text-[#6d7a6f]"
                        />
                        <p className="line-clamp-2 text-sm leading-relaxed">
                          {doctor.languages.length > 0
                            ? doctor.languages.join(", ")
                            : "Bahasa belum tersedia"}
                        </p>
                      </div>

                      <div className="mb-8 flex flex-wrap gap-2">
                        {(doctor.specialties.length > 0
                          ? doctor.specialties.slice(0, 3)
                          : [
                              {
                                slug: "specialization",
                                name: doctor.specialization,
                              },
                            ]
                        ).map((specialty, index) =>
                          specialty.name ? (
                            <span
                              key={`${specialty.slug}-${specialty.name}-${index}`}
                              className="rounded-md bg-[#f0edef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.05em] text-[#3d4a40]"
                            >
                              {specialty.name}
                            </span>
                          ) : null,
                        )}
                      </div>

                      <div className="mt-auto flex flex-col gap-2">
                        <a
                          href={getDoctorConsultationWhatsAppUrl(doctor)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#2bb673] px-4 text-sm font-bold text-[#004024] transition hover:bg-[#5cde97]"
                        >
                          Konsultasi
                        </a>
                        <Link
                          href={`/dokter/${doctor.slug || doctor.id}`}
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg text-sm font-semibold text-[#1b6299] transition hover:bg-[#d0e4ff]/40"
                        >
                          Lihat Profil
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#bccabd]/40 pt-8 md:flex-row">
                <p className="text-sm font-medium text-[#3d4a40]">
                  Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, filteredDoctors.length)}{" "}
                  dari {filteredDoctors.length} dokter
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                    className="flex size-10 items-center justify-center rounded-full border border-[#bccabd] text-[#1b1b1d] transition hover:border-[#006d40] hover:text-[#006d40] disabled:cursor-not-allowed disabled:text-[#c6c6cb]"
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
                            className="px-2 text-sm text-[#6d7a6f]"
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
                            ? "bg-[#006d40] text-white"
                            : "border border-[#bccabd] text-[#1b1b1d] hover:border-[#006d40] hover:text-[#006d40]"
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
                    className="flex size-10 items-center justify-center rounded-full border border-[#bccabd] text-[#1b1b1d] transition hover:border-[#006d40] hover:text-[#006d40] disabled:cursor-not-allowed disabled:text-[#c6c6cb]"
                    aria-label="Halaman berikutnya"
                  >
                    <Icon name="chevron_right" />
                  </button>
                </div>
              </div>

              <section className="mt-20 rounded-2xl border border-[#bccabd]/30 bg-[#f0edef] p-8 md:flex md:items-center md:justify-between md:gap-8">
                <div className="max-w-lg text-center md:text-left">
                  <h2 className="mb-2 text-3xl font-semibold leading-tight text-[#1b1b1d]">
                    Jaringan Medis Terpercaya
                  </h2>
                  <p className="leading-relaxed text-[#3d4a40]">
                    Dokter dalam direktori ini tersusun dari data rumah sakit
                    dan spesialisasi yang dapat Anda cari sesuai kebutuhan.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-0">
                  {[
                    ["verified", "Profil Dokter"],
                    ["medical_services", "Expert Care"],
                    ["language", "Multi Bahasa"],
                  ].map(([icon, label]) => (
                    <div
                      key={label}
                      className="flex w-32 flex-col items-center rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
                    >
                      <Icon
                        name={icon as IconName}
                        className="mb-2 !text-3xl text-[#006d40]"
                      />
                      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#1b1b1d]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>

      <ChatBot />
    </main>
  );
}
