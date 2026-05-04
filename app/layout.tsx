import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediSata - Layanan Berobat ke Luar Negeri",
  description:
    "Layanan pendamping pasien untuk berobat ke Malaysia dan Singapura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
