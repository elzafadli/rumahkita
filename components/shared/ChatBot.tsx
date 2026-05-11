"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STORAGE_KEY = "medical_chat_session_id";
const CHAT_STREAM_URL = "/api/chat/stream";
const CHAT_HISTORY_URL = (sessionId: string) =>
  `/api/chat/${encodeURIComponent(sessionId)}/history`;
const ASSISTANT_WHATSAPP_NUMBER = "6281216166848";
const SEND_TO_ASSISTANT_TOKENS = [":send-to-assistent", ":send-to-assistant"];

function getHospitalName(label: string) {
  return label.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function getDoctorName(label: string) {
  return label.split(" - ")[0].trim();
}

function formatListLabel(label: string) {
  return label.replace(/\s+-\s+/g, ", ");
}

function isListCardPart(part: string) {
  return /^(?:[-*]\s*)?\[(?:hospital|doctor):\d+\]\s*.+$/.test(part);
}

function getSendToAssistantMessage(content: string) {
  const normalizedContent = content.replace(/\\n/g, "\n");
  const tokenIndex = SEND_TO_ASSISTANT_TOKENS.reduce((currentIndex, token) => {
    const index = normalizedContent.indexOf(token);

    if (index === -1) {
      return currentIndex;
    }

    return currentIndex === -1 ? index : Math.min(currentIndex, index);
  }, -1);
  const contentBeforeToken =
    tokenIndex === -1
      ? normalizedContent
      : normalizedContent.slice(0, tokenIndex);
  const summaryIndex = contentBeforeToken.lastIndexOf("Ringkasan pilihan:");
  const summary =
    summaryIndex === -1
      ? contentBeforeToken.trim()
      : contentBeforeToken.slice(summaryIndex).trim();
  const plainSummary = summary
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  return `Saya ingin lanjut dengan pilihan ini:\n${plainSummary}`;
}

function sanitizeWhatsAppMessage(message: string) {
  return message
    .replace(/\*/g, "")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function getAssistantWhatsAppUrl(content: string) {
  const message = sanitizeWhatsAppMessage(getSendToAssistantMessage(content));

  return `https://wa.me/${ASSISTANT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRole(value: unknown): ChatRole | null {
  const role = getStringValue(value).toLowerCase();

  if (role === "assistant" || role === "bot" || role === "ai") {
    return "assistant";
  }

  if (role === "user" || role === "human" || role === "patient") {
    return "user";
  }

  return null;
}

function getHistoryItems(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [payload.data, payload.messages, payload.history];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function normalizeHistoryMessages(payload: unknown): ChatMessage[] {
  return getHistoryItems(payload).flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const role = normalizeRole(item.role ?? item.sender ?? item.type);
    const content = getStringValue(
      item.content ?? item.message ?? item.text ?? item.body,
    );

    if (role && content) {
      return [
        {
          id: getStringValue(item.id) || `history-${index}`,
          role,
          content,
        },
      ];
    }

    const question = getStringValue(item.question ?? item.user_message);
    const answer = getStringValue(item.answer ?? item.assistant_message);
    const messages: ChatMessage[] = [];

    if (question) {
      messages.push({
        id: `${getStringValue(item.id) || `history-${index}`}-user`,
        role: "user",
        content: question,
      });
    }

    if (answer) {
      messages.push({
        id: `${getStringValue(item.id) || `history-${index}`}-assistant`,
        role: "assistant",
        content: answer,
      });
    }

    return messages;
  });
}

function renderMessageContent(
  content: string,
  onSelect: (message: string) => void,
  isSending: boolean,
) {
  const parts = content
    .replace(/\\n/g, "\n")
    .split(
      /((?:[-*]\s*)?\[(?:hospital|doctor):\d+\]\s*[^\n]+|\[url:(?:hospitals|doctors)\]|:send-to-assist(?:e|a)nt|\*\*[\s\S]+?\*\*|\*[^*\n]+?:\*\*)/g,
    );
  const hasDoctorsLink = parts.includes("[url:doctors]");
  const lastDoctorPartIndex = parts.findLastIndex((part) =>
    isListCardPart(part),
  );

  return parts.map((part, index) => {
    if (
      /^\s+$/.test(part) &&
      (isListCardPart(parts[index - 1] ?? "") ||
        isListCardPart(parts[index + 1] ?? ""))
    ) {
      return null;
    }

    const hospitalMatch = part.match(/^(?:[-*]\s*)?\[hospital:(\d+)\]\s*(.+)$/);
    const doctorMatch = part.match(/^(?:[-*]\s*)?\[doctor:(\d+)\]\s*(.+)$/);

    if (hospitalMatch) {
      const label = hospitalMatch[2].trim();
      const hospitalName = getHospitalName(label);

      return (
        <span
          key={`${part}-${index}`}
          className="my-0.5 flex w-full flex-col gap-1.5 rounded-2xl border border-emerald-100 bg-emerald-50 p-2.5"
        >
          <span className="break-words text-xs font-semibold leading-snug text-emerald-900">
            {formatListLabel(label)}
          </span>
          <span className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => onSelect(`Rumah Sakit: ${hospitalName}`)}
              disabled={isSending}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-1 text-[11px] font-semibold leading-none text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              title={hospitalName}
            >
              Pilih
              <Icon name="send" className="!text-xs" />
            </button>
            <a
              href="/rumah-sakit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-700 px-2 py-1 text-[11px] font-semibold leading-none text-white transition hover:bg-emerald-800"
              title={`Lihat detail ${hospitalName}`}
            >
              Detail
              <Icon name="open_in_new" className="!text-xs" />
            </a>
          </span>
        </span>
      );
    }

    if (doctorMatch) {
      const doctorId = doctorMatch[1];
      const label = doctorMatch[2].trim();
      const doctorName = getDoctorName(label);

      return (
        <span key={`${part}-${index}`}>
          <span className="my-2 flex w-full flex-col gap-1.5 rounded-2xl border border-sky-100 bg-sky-50 p-2.5">
            <span className="break-words text-xs font-semibold leading-snug text-sky-900">
              {formatListLabel(label)}
            </span>
            <span className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => onSelect(`Dokter: ${doctorName}`)}
                disabled={isSending}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-white px-2 py-1 text-[11px] font-semibold leading-none text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                title={doctorName}
              >
                Pilih
                <Icon name="send" className="!text-xs" />
              </button>
                <a
                  href={`/dokter/${doctorId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-sky-200 bg-sky-700 px-2 py-1 text-[11px] font-semibold leading-none text-white transition hover:bg-sky-800"
                  title={`Lihat detail ${doctorName}`}
                >
                Detail
                <Icon name="arrow_forward" className="!text-xs" />
              </a>
            </span>
          </span>
          {!hasDoctorsLink && index === lastDoctorPartIndex ? (
            <a
              href="/dokter"
              target="_blank"
              rel="noopener noreferrer"
              className="my-0.5 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
              title="Lihat daftar dokter"
            >
              Lihat Daftar Dokter
              <Icon name="open_in_new" className="!text-sm" />
            </a>
          ) : null}
        </span>
      );
    }

    if (part === "[url:hospitals]" || part === "[url:doctors]") {
      const isDoctorsLink = part === "[url:doctors]";

      return (
        <a
          key={`${part}-${index}`}
          href={isDoctorsLink ? "/dokter" : "/rumah-sakit"}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 inline-flex items-center gap-1.5 border px-4 py-2 font-semibold transition ${
            isDoctorsLink
              ? "w-full justify-center rounded-2xl border-sky-200 bg-white text-xs text-sky-700 hover:bg-sky-50"
              : "rounded-full border-emerald-200 bg-emerald-50 text-sm text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
          }`}
        >
          {isDoctorsLink ? "Lihat Daftar Dokter" : "Lihat Rumah Sakit"}
          <span
            className="material-symbols-outlined !text-base"
            aria-hidden="true"
          >
            open_in_new
          </span>
        </a>
      );
    }

    if (SEND_TO_ASSISTANT_TOKENS.includes(part.trim())) {
      return (
        <a
          key={`${part}-${index}`}
          href={getAssistantWhatsAppUrl(content)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
        >
          Kirim pilihan ke WhatsApp
          <Icon name="send" className="!text-sm" />
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold">
          {part.slice(1, -2)}
        </strong>
      );
    }

    return part;
  });
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo, saya siap bantu informasi berobat, dokter, rumah sakit, dan persiapan perjalanan medis Anda.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem(STORAGE_KEY);

    setSessionId(storedSessionId);

    if (!storedSessionId) {
      return;
    }

    const activeSessionId = storedSessionId;
    let isMounted = true;

    async function loadHistory() {
      try {
        setIsLoadingHistory(true);

        const response = await fetch(CHAT_HISTORY_URL(activeSessionId), {
          headers: { Accept: "application/json" },
        });

        if (response.status === 404) {
          localStorage.removeItem(STORAGE_KEY);
          if (isMounted) {
            setSessionId(null);
          }
          return;
        }

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const historyMessages = normalizeHistoryMessages(payload);

        if (isMounted && historyMessages.length > 0) {
          setMessages(historyMessages);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isSending]);

  async function sendChatMessage(content: string) {
    if (!content || isSending) {
      return;
    }

    const assistantId = crypto.randomUUID();

    setInput("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch(CHAT_STREAM_URL, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          ...(sessionId ? { session_id: sessionId } : {}),
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        if (response.status === 404) {
          localStorage.removeItem(STORAGE_KEY);
          setSessionId(null);
        }
        throw new Error(text || "Chat belum bisa dihubungi.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const appendAssistantText = (delta: string) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + delta }
              : message,
          ),
        );
      };

      const setAssistantText = (text: string) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: text }
              : message,
          ),
        );
      };

      const processBlock = (block: string) => {
        const eventName = block.match(/^event:\s*(.+)$/m)?.[1]?.trim();
        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");

        if (!eventName || !data) {
          return;
        }

        const payload = JSON.parse(data);

        if (eventName === "message" && payload.delta) {
          appendAssistantText(payload.delta);
          return;
        }

        if (eventName === "done") {
          if (payload.session_id) {
            localStorage.setItem(STORAGE_KEY, payload.session_id);
            setSessionId(payload.session_id);
          }

          if (payload.message?.content) {
            setAssistantText(payload.message.content);
          }
          return;
        }

        if (eventName === "error") {
          setAssistantText(
            payload.message ??
              "Maaf, layanan chat sedang bermasalah. Silakan coba lagi.",
          );
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });

        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          processBlock(block);
        }

        if (done) {
          break;
        }
      }

      if (buffer.trim()) {
        processBlock(buffer);
      }
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content:
                  error instanceof Error
                    ? error.message
                    : "Maaf, layanan chat sedang bermasalah. Silakan coba lagi.",
              }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendChatMessage(input.trim());
  }

  function resetSession() {
    localStorage.removeItem(STORAGE_KEY);
    setSessionId(null);
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Session baru sudah dimulai. Ada yang bisa saya bantu?",
      },
    ]);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {isOpen ? (
        <section
          aria-label="Chat customer service"
          className="flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
        >
          <header className="flex items-center justify-between border-b border-gray-100 bg-black px-5 py-4 text-white">
            <div>
              <p className="text-sm font-semibold">Customer Service</p>
              <p className="text-xs text-white/60">
                Berobat & perjalanan medis
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetSession}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Mulai chat baru"
                title="Mulai chat baru"
              >
                <Icon name="refresh" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Tutup chat"
                title="Tutup chat"
              >
                <Icon name="close" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7f8] px-4 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] break-words whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "border border-gray-200 bg-white text-[#1a1c1d]"
                  }`}
                >
                  {message.content
                    ? renderMessageContent(
                        message.content,
                        sendChatMessage,
                        isSending || isLoadingHistory,
                      )
                    : message.role === "assistant"
                      ? "Sedang mengetik..."
                      : ""}
                </div>
              </div>
            ))}
            {isLoadingHistory ? (
              <div className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-[#1a1c1d]">
                  Memuat riwayat chat...
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex gap-2 border-t border-gray-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-11 flex-1 rounded-full border border-gray-200 px-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black"
              placeholder={
                isSending || isLoadingHistory
                  ? "Boleh ketik pertanyaan berikutnya..."
                  : "Tulis pertanyaan..."
              }
            />
            <button
              type="submit"
              disabled={isSending || isLoadingHistory || input.trim() === ""}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              aria-label="Kirim pesan"
              title="Kirim pesan"
            >
              <Icon name="send" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`size-14 items-center justify-center rounded-full bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition hover:bg-gray-800 active:scale-95 md:flex ${
          isOpen ? "hidden" : "flex"
        }`}
        aria-label="Buka chat"
        title="Buka chat"
      >
        <Icon name={isOpen ? "close" : "support_agent"} className="!text-3xl" />
      </button>
    </div>
  );
}
