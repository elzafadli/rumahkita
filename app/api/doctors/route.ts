import { NextResponse } from "next/server";
import { buildApiUrl } from "@/constants/api";

export const revalidate = 3600;

function getDoctorsCacheTags(hospitalId: string) {
  return ["doctors", `hospital-${hospitalId}-doctors`];
}

function withDoctorsCacheScope(url: string, hospitalId: string) {
  const scopedUrl = new URL(url);
  scopedUrl.searchParams.set("hospitalId", hospitalId);

  return scopedUrl.toString();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hospitalId = searchParams.get("hospitalId") ?? "2";
  const doctorsUrl = buildApiUrl(`/${hospitalId}/doctors`);

  if (!doctorsUrl) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(withDoctorsCacheScope(doctorsUrl, hospitalId), {
      headers: { Accept: "application/json" },
      next: {
        revalidate,
        tags: getDoctorsCacheTags(hospitalId),
      },
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
