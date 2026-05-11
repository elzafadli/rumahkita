import { NextResponse } from "next/server";
import { buildApiUrl } from "@/constants/api";

export const revalidate = 3600;

export async function GET() {
  const doctorsUrl = buildApiUrl("/2/doctors");

  if (!doctorsUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(doctorsUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Unexpected doctors API response." },
        { status: response.ok ? 502 : response.status },
      );
    }

    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Data dokter belum bisa dimuat." },
      { status: 502 },
    );
  }
}
