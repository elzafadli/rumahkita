import { buildApiUrl } from "@/constants/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const chatHistoryUrl = buildApiUrl(
    `/chat/${encodeURIComponent(sessionId)}/history`,
  );

  if (!chatHistoryUrl) {
    return Response.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(chatHistoryUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return Response.json(
        { message: "Unexpected chat history API response." },
        { status: response.ok ? 502 : response.status },
      );
    }

    const payload = await response.json();

    return Response.json(payload, { status: response.status });
  } catch {
    return Response.json(
      { message: "Riwayat chat belum bisa dimuat." },
      { status: 502 },
    );
  }
}
