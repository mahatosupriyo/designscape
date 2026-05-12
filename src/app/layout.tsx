import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Scape",
  description: "Independent Design Studio and Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
