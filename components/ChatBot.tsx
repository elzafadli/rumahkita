"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const STORAGE_KEY = "medical_chat_session_id";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

function renderMessageContent(content: string) {
  return content
    .replace(/\\n/g, "\n")
    .split(/(\[url:(?:hospitals|doctors)\]|\*\*[\s\S]+?\*\*|\*[^*\n]+?:\*\*)/g)
    .map((part, index) => {
      if (part === "[url:hospitals]" || part === "[url:doctors]") {
        const isDoctorsLink = part === "[url:doctors]";

        return (
          <a
            key={`${part}-${index}`}
            href={isDoctorsLink ? "/dokter" : "/rumah-sakit"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800"
          >
            {isDoctorsLink ? "Lihat Dokter" : "Lihat Rumah Sakit"}
            <span className="material-symbols-outlined !text-base" aria-hidden="true">
              open_in_new
            </span>
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
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo, saya siap bantu informasi berobat, dokter, rumah sakit, dan persiapan perjalanan medis Anda.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chatStreamUrl = useMemo(
    () => `${API_BASE_URL.replace(/\/$/, "")}/chat/stream`,
    [],
  );

  useEffect(() => {
    setSessionId(localStorage.getItem(STORAGE_KEY));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages, isSending]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

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
      const response = await fetch(chatStreamUrl, {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          session_id: sessionId,
        }),
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
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
            message.id === assistantId ? { ...message, content: text } : message,
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
            payload.message ?? "Maaf, layanan chat sedang bermasalah. Silakan coba lagi.",
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
              <p className="text-xs text-white/60">Berobat & perjalanan medis</p>
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
                  className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "border border-gray-200 bg-white text-[#1a1c1d]"
                  }`}
                >
                  {message.content
                    ? renderMessageContent(message.content)
                    : message.role === "assistant"
                      ? "Sedang mengetik..."
                      : ""}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-100 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-11 flex-1 rounded-full border border-gray-200 px-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black"
              placeholder={isSending ? "Boleh ketik pertanyaan berikutnya..." : "Tulis pertanyaan..."}
            />
            <button
              type="submit"
              disabled={isSending || input.trim() === ""}
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
        className="flex size-14 items-center justify-center rounded-full bg-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition hover:bg-gray-800 active:scale-95"
        aria-label="Buka chat"
        title="Buka chat"
      >
        <Icon name={isOpen ? "close" : "support_agent"} className="!text-3xl" />
      </button>
    </div>
  );
}
