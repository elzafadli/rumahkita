import { buildApiUrl } from "@/constants/api";

export async function POST(request: Request) {
  const chatStreamUrl = buildApiUrl("/chat/stream");

  if (!chatStreamUrl) {
    return Response.json(
      { message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const requestBody = await request.json();

    if (
      !requestBody ||
      typeof requestBody !== "object" ||
      typeof requestBody.message !== "string"
    ) {
      return Response.json(
        { message: "Message is required." },
        { status: 400 },
      );
    }

    const sessionId =
      typeof requestBody.session_id === "string" &&
      requestBody.session_id.trim() !== ""
        ? requestBody.session_id
        : null;
    const upstreamBody = {
      message: requestBody.message,
      ...(sessionId ? { session_id: sessionId } : {}),
    };

    let response = await fetch(chatStreamUrl, {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamBody),
      cache: "no-store",
    });

    if (response.status === 404 && sessionId) {
      response = await fetch(chatStreamUrl, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: requestBody.message }),
        cache: "no-store",
      });
    }

    if (!response.ok) {
      return Response.json(
        {
          message: (await response.text()) || "Chat upstream request failed.",
        },
        { status: response.status },
      );
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch {
    return Response.json(
      { message: "Maaf, layanan chat sedang bermasalah. Silakan coba lagi." },
      { status: 502 },
    );
  }
}
