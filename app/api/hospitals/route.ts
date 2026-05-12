import { NextResponse } from "next/server";
import { buildApiUrl } from "@/constants/api";

export const revalidate = 3600;

export async function GET() {
  const hospitalsUrl = buildApiUrl("/hospitals");

  if (!hospitalsUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(hospitalsUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Unexpected hospitals API response." },
        { status: response.ok ? 502 : response.status },
      );
    }

    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Data rumah sakit belum bisa dimuat." },
      { status: 502 },
    );
  }
}
