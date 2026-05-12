import type { Doctor } from "@/types/doctor";

export const ASSISTANT_WHATSAPP_NUMBER = "6281216166848";

export function sanitizeWhatsAppMessage(message: string) {
  return message
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function getAssistantWhatsAppUrl(message: string) {
  const sanitizedMessage = sanitizeWhatsAppMessage(message);

  return `https://wa.me/${ASSISTANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    sanitizedMessage,
  )}`;
}

export function getDoctorConsultationWhatsAppUrl(doctor: Doctor) {
  const specialty =
    doctor.specialization ||
    doctor.specialties.map((item) => item.name).filter(Boolean).join(", ") ||
    "Belum tersedia";
  const hospital = doctor.hospital
    ? `${doctor.hospital.name}, ${doctor.hospital.city}`
    : "Belum tersedia";
  const message = `Halo, Saya ingin konsultasi dengan Kantor Perwakilan Resmi Mahkota Medical Centre dan Regency Specialist Hospital.

Saya tertarik konsultasi dengan:
Dokter: ${doctor.name}
Spesialisasi: ${specialty}
Rumah Sakit: ${hospital}

Mohon bantuannya untuk konsultasi lebih lanjut. Terima kasih`;

  return getAssistantWhatsAppUrl(message);
}
